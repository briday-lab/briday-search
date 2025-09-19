// pages/index.js
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function searchCaptions() {
    if (!query) return;
    const { data, error } = await supabase
      .from("tags")
      .select("id, wedding_id, clip_name, start_sec, caption, video_path")
      .ilike("caption", `%${query}%`);

    if (error) {
      console.error("❌ Search error:", error.message);
      return;
    }

    setResults(data || []);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎥 Briday Search</h1>

      <input
        type="text"
        placeholder="Search your wedding..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button
        onClick={searchCaptions}
        style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
      >
        Search
      </button>

      <div style={{ marginTop: "2rem" }}>
        {results.length === 0 && <p>No results yet...</p>}

        {results.map((item) => {
          const videoUrl = item.video_path
            ? `https://f003.backblazeb2.com/file/briday-weddings-archive/${item.video_path}#t=${item.start_sec}`
            : null;

          return (
            <div
              key={item.id}
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>{item.caption}</h3>
              <p>
                Clip: <strong>{item.clip_name}</strong> — Start:{" "}
                {item.start_sec}s
              </p>

              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  width="600"
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <p style={{ color: "red" }}>
                  ⚠️ No video_path found for this result
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
