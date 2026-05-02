'use client';

import { FormEvent, useMemo, useState } from 'react';
import { PencilLine, Plus, Search, Star } from 'lucide-react';

type Movie = {
  id: string;
  title: string;
  rating: string;
  synopsis: string;
  poster: string;
};

const initialMovies: Movie[] = [
  {
    id: '0890',
    title: 'Neon Vanguard',
    rating: '8.5',
    synopsis: 'In a future where memory is a luxury, one courier risks everything to restore the truth.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '0891',
    title: 'Emerald Dreams',
    rating: '9.0',
    synopsis: 'A quiet traveler discovers a crystal forest that mirrors every choice she has ever made.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '0892',
    title: 'Midnight Platform',
    rating: '8.1',
    synopsis: 'The last train home becomes a maze of vanished passengers and unfinished goodbyes.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
  },
];

const emptyMovie: Movie = {
  id: '',
  title: '',
  rating: '',
  synopsis: '',
  poster: '',
};

export default function EditMoviePage() {
  const [movies, setMovies] = useState(initialMovies);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Movie>(initialMovies[0]);
  const [mode, setMode] = useState<'edit' | 'add'>('edit');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) => {
      return (
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.id.toLowerCase().includes(normalizedQuery) ||
        movie.synopsis.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [movies, query]);

  const selectMovie = (movie: Movie) => {
    setMode('edit');
    setDraft(movie);
    setSavedMessage('');
  };

  const startAddingMovie = () => {
    setMode('add');
    setDraft({
      ...emptyMovie,
      id: `0${String(movies.length + 890)}`,
      poster:
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80',
    });
    setSavedMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'add') {
      setMovies((currentMovies) => [draft, ...currentMovies]);
      setMode('edit');
      setSavedMessage(`Added "${draft.title}" to movie list.`);
      return;
    }

    setMovies((currentMovies) =>
      currentMovies.map((movie) => (movie.id === draft.id ? draft : movie)),
    );
    setSavedMessage(`Saved changes to "${draft.title}".`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(31,58,44,0.95),_rgba(10,16,12,1)_55%)] p-8 text-gray-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[28px] border border-emerald-900/60 bg-[#122018]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500/80">
                Movie Console
              </p>
              <h1 className="text-3xl font-semibold tracking-wide text-white">จัดการภาพยนตร์</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                ค้นหา แก้ไข และเพิ่มรายการภาพยนตร์ในหน้าเดียว เพื่อให้ flow ของแอดมินอยู่ในรูปแบบ React
                เหมือนส่วนอื่นของระบบ
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-w-[280px] items-center gap-3 rounded-2xl border border-emerald-900/60 bg-[#0d1510] px-4 py-3 text-sm text-gray-300">
                <Search className="h-4 w-4 text-emerald-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search films, IDs, synopsis..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-500"
                />
              </label>

              <button
                type="button"
                onClick={startAddingMovie}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110b] transition hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" />
                Add Movie
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
          <section className="rounded-[28px] border border-[#1f3025] bg-[#111b15] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Movie Library</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredMovies.length} movie{filteredMovies.length === 1 ? '' : 's'} ready for update
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredMovies.map((movie) => {
                const isSelected = draft.id === movie.id && mode === 'edit';

                return (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => selectMovie(movie)}
                    className={`group overflow-hidden rounded-[24px] border text-left transition ${
                      isSelected
                        ? 'border-emerald-400 bg-[#1a2c21] shadow-[0_16px_40px_rgba(16,185,129,0.15)]'
                        : 'border-[#223328] bg-[#16231b] hover:border-emerald-700 hover:bg-[#19281f]'
                    }`}
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08100b] via-[#08100b]/10 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-emerald-400/40 bg-[#0c1510]/80 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-emerald-300">
                        ID {movie.id}
                      </div>
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#223629] px-3 py-1 text-xs font-semibold text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {movie.rating}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-sm leading-6 text-gray-400">{movie.synopsis}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredMovies.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[#2b4032] bg-[#0f1712] px-6 py-10 text-center text-sm text-gray-500">
                No movies match your search. Try a different keyword.
              </div>
            ) : null}
          </section>

          <section className="rounded-[28px] border border-[#1f3025] bg-[#0f1712] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500/80">
                  {mode === 'add' ? 'Add New Movie' : 'Edit Selected Movie'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {mode === 'add' ? 'Create a new movie entry' : draft.title}
                </h2>
              </div>
              <div className="rounded-full border border-[#294032] bg-[#142019] p-3 text-emerald-300">
                <PencilLine className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-300">
                  <span>Movie ID</span>
                  <input
                    value={draft.id}
                    onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value }))}
                    className="w-full rounded-2xl border border-[#24352a] bg-[#16211b] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="space-y-2 text-sm text-gray-300">
                  <span>Rating</span>
                  <input
                    value={draft.rating}
                    onChange={(event) => setDraft((current) => ({ ...current, rating: event.target.value }))}
                    className="w-full rounded-2xl border border-[#24352a] bg-[#16211b] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Movie Title</span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-[#24352a] bg-[#16211b] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Poster URL</span>
                <input
                  value={draft.poster}
                  onChange={(event) => setDraft((current) => ({ ...current, poster: event.target.value }))}
                  className="w-full rounded-2xl border border-[#24352a] bg-[#16211b] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
              </label>

              <label className="space-y-2 text-sm text-gray-300">
                <span>Synopsis</span>
                <textarea
                  value={draft.synopsis}
                  onChange={(event) => setDraft((current) => ({ ...current, synopsis: event.target.value }))}
                  rows={6}
                  className="w-full rounded-[24px] border border-[#24352a] bg-[#16211b] px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="overflow-hidden rounded-[28px] border border-[#223328] bg-[#16231b]">
                <img src={draft.poster} alt={draft.title || 'Movie preview'} className="h-56 w-full object-cover" />
              </div>

              <div className="flex flex-col gap-3 border-t border-[#1f3025] pt-5">
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#08110c] transition hover:bg-emerald-400"
                >
                  {mode === 'add' ? 'Save New Movie' : 'Save Changes'}
                </button>

                {mode === 'add' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('edit');
                      setDraft(movies[0]);
                    }}
                    className="rounded-2xl border border-[#2a3c31] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-emerald-600 hover:text-white"
                  >
                    Cancel
                  </button>
                ) : null}

                {savedMessage ? <p className="text-sm text-emerald-400">{savedMessage}</p> : null}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
