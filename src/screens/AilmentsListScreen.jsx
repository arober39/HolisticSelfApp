import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../database/database';
import { format } from 'date-fns';
import { getLaunchDarklyClient } from '../services/launchdarkly';
import './ScreenStyles.css';

function AilmentCard({ item, onDelete, onNavigate }) {
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [s, m] = await Promise.all([
        db.getSymptomsByAilment(item.id),
        db.getMedicationsByAilment(item.id)
      ]);
      setSymptoms(s);
      setMedications(m);
    };
    loadData();
  }, [item.id]);

  return (
    <div
      className="card"
      onClick={onNavigate}
    >
      <div className="card-header">
        <div className="card-title-container">
          <h2 className="card-title">{item.name}</h2>
          <p className="date-text">
            Created: {format(new Date(item.dateCreated), 'MMM dd, yyyy')}
          </p>
        </div>
        <button
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          🗑️
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">{symptoms.length}</span>
          <span className="stat-label">Symptoms</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{medications.length}</span>
          <span className="stat-label">Medications</span>
        </div>
      </div>

      {item.notes && (
        <p className="notes" style={{ marginTop: '8px' }}>
          {item.notes.length > 100 ? `${item.notes.substring(0, 100)}...` : item.notes}
        </p>
      )}
    </div>
  );
}

export default function AilmentsListScreen() {
  const navigate = useNavigate();
  const [ailments, setAilments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestButton, setShowTestButton] = useState(false);

  useEffect(() => {
    loadAilments();
  }, []);

  useEffect(() => {
    // Check feature flag for test rage click button
    const checkFeatureFlag = () => {
      const client = getLaunchDarklyClient();
      console.log('[Feature Flag Debug] Checking flag, client available:', !!client);
      
      if (client) {
        try {
          const flagValue = client.variation('test-rage-click-button', false);
          console.log('[Feature Flag Debug] Flag value for test-rage-click-button:', flagValue);
          setShowTestButton(flagValue);
        } catch (error) {
          console.error('[Feature Flag Debug] Error checking test-rage-click-button flag:', error);
          setShowTestButton(false);
        }
      } else {
        console.log('[Feature Flag Debug] LaunchDarkly client not available yet');
      }
    };

    // Check immediately
    checkFeatureFlag();

    // Retry mechanism - check periodically until client is ready
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(() => {
      const client = getLaunchDarklyClient();
      if (client) {
        console.log('[Feature Flag Debug] Client is now available, checking flag');
        checkFeatureFlag();
        clearInterval(retryInterval);
      } else {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.warn('[Feature Flag Debug] LaunchDarkly client not available after', maxRetries, 'retries');
          clearInterval(retryInterval);
        }
      }
    }, 500); // Check every 500ms

    // Set up listener for flag changes
    const setupListener = () => {
      const client = getLaunchDarklyClient();
      if (client) {
        console.log('[Feature Flag Debug] Setting up flag change listener');
        client.on('change:test-rage-click-button', checkFeatureFlag);
        // Also listen for when client becomes ready
        client.on('ready', () => {
          console.log('[Feature Flag Debug] LaunchDarkly client is ready, checking flag');
          checkFeatureFlag();
        });
      }
    };

    // Try to set up listener immediately
    setupListener();

    // Also try to set up listener after a short delay (in case client initializes)
    const listenerTimeout = setTimeout(setupListener, 1000);

    // Cleanup listeners and intervals on unmount
    return () => {
      clearInterval(retryInterval);
      clearTimeout(listenerTimeout);
      const client = getLaunchDarklyClient();
      if (client) {
        client.off('change:test-rage-click-button', checkFeatureFlag);
        client.off('ready', checkFeatureFlag);
      }
    };
  }, []);

  const loadAilments = async () => {
    try {
      const loadedAilments = await db.getAllAilments();
      setAilments(loadedAilments);
    } catch (error) {
      console.error('Error loading ailments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAilment = async (id) => {
    if (window.confirm('Are you sure you want to delete this ailment?')) {
      try {
        await db.deleteAilment(id);
        loadAilments();
      } catch (error) {
        console.error('Error deleting ailment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-container">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Health Tracker</h1>
        {showTestButton && (
        <button
        id="test-rage-click-button"
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
        onClick={(e) => {
          // Intentionally does nothing - for testing rage clicks
          e.preventDefault();
          console.log('Test button clicked (intentionally non-functional for rage click testing)');
        }}
        title="Test Rage Click Detection: Click rapidly 5+ times within 2 seconds in the same spot"
      >
        🧪 Test Rage Click (Click Rapidly)
      </button>
        )}
        </div>

      {ailments.length === 0 ? (
        <div className="empty-container">
          <p className="empty-text">No ailments tracked yet</p>
          <p className="empty-subtext">
            Click the + button to add your first health condition
          </p>
        </div>
      ) : (
        <div className="list-container">
          {ailments.map((item) => (
            <AilmentCard
              key={item.id}
              item={item}
              onDelete={handleDeleteAilment}
              onNavigate={() => navigate(`/ailment/${item.id}`)}
            />
          ))}
        </div>
      )}

      <button
        className="fab"
        onClick={() => navigate('/add-ailment')}
        title="Add Ailment"
      >
        +
      </button>
    </div>
  );
}

