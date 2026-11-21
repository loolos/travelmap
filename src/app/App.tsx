import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { EgyptMap } from '../map/EgyptMap';
import { TopNav } from './TopNav';
import { PlacePanel } from '../places/PlacePanel';
import { placeById } from '../data/content';
import { useMediaQuery } from './useMediaQuery';
import { NotesPage } from '../pages/NotesPage';
import { JournalPage } from '../pages/JournalPage';
import { DeitiesPage } from '../pages/DeitiesPage';
import { GlyphsPage } from '../pages/GlyphsPage';
import { TimelinePage } from '../pages/TimelinePage';
import { OfflinePage } from '../offline/OfflinePage';
import { ActivityPage } from '../pages/ActivityPage';
import { Sheet } from './Sheet';
import styles from './App.module.css';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const placeMatch = useMatch('/place/:id/*');
  const placeId = placeMatch?.params.id;
  const regionMatch = useMatch('/map/:regionId');
  const resetSignal = (location.state as { reset?: number } | null)?.reset;
  const place = placeId ? placeById.get(placeId) : undefined;
  const wide = useMediaQuery('(min-width: 900px)');
  const [drawer, setDrawer] = useState<'peek' | 'full'>('peek');

  const selectFromMap = (id: string) => {
    setDrawer('peek');
    navigate(`/place/${id}`, { state: { from: 'map' } });
  };

  // Menu/link navigation opens the drawer fully; map taps open a peek.
  const fromMap = (location.state as { from?: string } | null)?.from === 'map';
  const drawerState = wide ? 'full' : fromMap ? drawer : 'full';

  const inset = place
    ? wide
      ? { right: 400, bottom: 0 }
      : { right: 0, bottom: drawerState === 'peek' ? 132 : 0 }
    : { right: 0, bottom: 0 };

  return (
    <div className={styles.app}>
      <TopNav />
      <main className={styles.main}>
        <EgyptMap
          selectedId={place?.id}
          focusRegionId={regionMatch?.params.regionId}
          resetSignal={resetSignal}
          onSelect={selectFromMap}
          inset={inset}
        />
        {place && (
          <PlacePanel
            key={place.id}
            place={place}
            wide={wide}
            state={drawerState}
            onExpand={() => {
              setDrawer('full');
              if (fromMap) navigate(location.pathname, { replace: true, state: { from: 'map' } });
            }}
            onCollapse={() => {
              setDrawer('peek');
              navigate(location.pathname, { replace: true, state: { from: 'map' } });
            }}
            onClose={() => navigate('/map')}
          />
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={null} />
          <Route path="/map/:regionId" element={null} />
          <Route path="/place/:id" element={place ? null : <Navigate to="/map" replace />} />
          <Route path="/place/:id/:activity" element={<ActivityPage />} />
          <Route
            path="/notes/:regionId?"
            element={
              <Sheet title="旅人手記">
                <NotesPage />
              </Sheet>
            }
          />
          <Route
            path="/knowledge/:regionId?"
            element={
              <Sheet title="知識卡">
                <NotesPage kind="knowledge" />
              </Sheet>
            }
          />
          <Route
            path="/glyphs"
            element={
              <Sheet title="象形文字小字典">
                <GlyphsPage />
              </Sheet>
            }
          />
          <Route
            path="/deities"
            element={
              <Sheet title="神祇圖鑑">
                <DeitiesPage />
              </Sheet>
            }
          />
          <Route
            path="/timeline/:eraId?"
            element={
              <Sheet title="埃及歷史時間線">
                <TimelinePage />
              </Sheet>
            }
          />
          <Route
            path="/journal"
            element={
              <Sheet title="探索日誌">
                <JournalPage />
              </Sheet>
            }
          />
          <Route
            path="/offline"
            element={
              <Sheet title="離線下載">
                <OfflinePage />
              </Sheet>
            }
          />
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </main>
    </div>
  );
}
