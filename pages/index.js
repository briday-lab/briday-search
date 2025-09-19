import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);

  async function handleSearch() {
    const { data, error } = await supabase
      .from('tags')
      .select('clip_path, caption, start_sec, wedding_id')
      .ilike('caption', `%${query}%`);

    if (error) {
      console.error(error);
    } else {
      setResults(data);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🎥 Briday Search</h1>

      <input
        type="text"
        placeholder="Search captions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.caption}</strong> ({r.clip_path}){' '}
            <button
              onClick={() =>
                setVideoUrl(
                  `https://f003.backblazeb2.com/file/briday-weddings-archive/${r.clip_path}#t=${r.start_sec}`
                )
              }
            >
              ▶ Play
            </button>
          </li>
        ))}
      </ul>

      {videoUrl && (
        <video width="640" height="360" controls autoPlay>
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
