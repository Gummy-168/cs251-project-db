'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowLeft, Camera, Plus, Save, Search, Star, Trash2 } from 'lucide-react';

type Movie = {
  id: string;
  title: string;
  rating: string;
  synopsis: string;
  poster: string;
  releaseDate: string;
  genre: string;
  duration: string;
};

const initialMovies: Movie[] = [
  {
    id: '0890',
    title: 'Neon Vanguard',
    rating: '8.5',
    synopsis:
      'In a future where memory is a luxury, one detective hunts for the architect behind a citywide blackout of truth.',
    poster:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    releaseDate: '2026-10-19',
    genre: 'Sci-Fi',
    duration: '2h 15m',
  },
  {
    id: '1042',
    title: 'The Silent Echo',
    rating: '8.2',
    synopsis:
      'Deep in the woods, silence is not an absence but a warning that something old has started listening again.',
    poster:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    releaseDate: '2026-11-02',
    genre: 'Thriller',
    duration: '1h 58m',
  },
  {
    id: '0955',
    title: 'Last Reel',
    rating: '7.9',
    synopsis:
      'A retired projectionist finds a lost film canister that records the secrets his town buried decades ago.',
    poster:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    releaseDate: '2026-12-12',
    genre: 'Mystery',
    duration: '1h 47m',
  },
  {
    id: '1329',
    title: 'Velocity Zero',
    rating: '8.7',
    synopsis:
      'When physics breaks down, the only thing that matters is how fast fear spreads through a stranded convoy.',
    poster:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
    releaseDate: '2026-08-08',
    genre: 'Action',
    duration: '2h 03m',
  },
  {
    id: '8723',
    title: 'Emerald Shadow',
    rating: '8.0',
    synopsis:
      'A private eye takes a case that leads him into the dark underbelly of the city and a name no one says twice.',
    poster:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    releaseDate: '2026-09-14',
    genre: 'Neo-Noir',
    duration: '2h 09m',
  },
];

const emptyMovie: Movie = {
  id: '',
  title: '',
  rating: '',
  synopsis: '',
  poster: '',
  releaseDate: '',
  genre: '',
  duration: '',
};

export default function EditMoviePage() {
  const [movies, setMovies] = useState(initialMovies);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Movie>(initialMovies[0]);
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) =>
      [movie.title, movie.id, movie.genre, movie.synopsis].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [movies, query]);

  const openEditMovie = (movie: Movie) => {
    setDraft(movie);
    setMode('edit');
    setSavedMessage('');
  };

  const openAddMovie = () => {
    setDraft({
      ...emptyMovie,
      id: `ID-${String(8900 + movies.length).padStart(4, '0')}`,
      rating: '8.5',
    });
    setMode('add');
    setSavedMessage('');
  };

  const goBackToList = () => {
    setMode('list');
    setSavedMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'add') {
      setMovies((currentMovies) => [draft, ...currentMovies]);
      setSavedMessage(`Added "${draft.title}" to movie list.`);
      setMode('list');
      return;
    }

    setMovies((currentMovies) =>
      currentMovies.map((movie) => (movie.id === draft.id ? draft : movie)),
    );
    setSavedMessage(`Saved changes to "${draft.title}".`);
    setMode('list');
  };

  const hasPoster = draft.poster.trim().length > 0;

  if (mode === 'list') {
    return (
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(13,41,24,0.92),_rgba(7,15,10,1)_58%)] px-6 py-8 text-gray-100 xl:px-8">
        <section className="mx-auto w-full max-w-[1320px] rounded-[26px] border border-[#173322] bg-[#08110b]/95 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <div className="border-b border-[#13311f] px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-6">
                <div className="min-w-[120px]">
                  <p className="text-sm font-medium text-emerald-500">EMERALD CINEMA</p>
                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                    Projection Booth V2.0
                  </p>
                </div>

                <div>
                  <h1 className="text-3xl font-medium text-white">จัดการภาพยนตร์ (Edit Movie)</h1>
                  <div className="mt-2 h-[3px] w-16 rounded-full bg-emerald-500" />
                </div>
              </div>

              <label className="flex w-full max-w-sm items-center gap-3 rounded-full border border-[#213728] bg-[#19261c] px-4 py-2.5 text-sm text-gray-300">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search films..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-500"
                />
              </label>
            </div>
          </div>

          <div className="p-6">
            {savedMessage ? <p className="mb-4 text-sm text-emerald-400">{savedMessage}</p> : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredMovies.map((movie) => (
                <article
                  key={movie.id}
                  className="rounded-[10px] border border-[#243326] bg-[#1a241b] transition hover:border-emerald-700 hover:bg-[#1e2a20]"
                >
                  <div className="relative overflow-hidden rounded-t-[10px]">
                    <img src={movie.poster} alt={movie.title} className="h-56 w-full object-cover" />
                    <div className="absolute left-2 top-2 rounded bg-[#49d76f] px-2 py-1 text-[9px] font-bold text-[#061008]">
                      ID-{movie.id}
                    </div>
                  </div>

                  <div className="space-y-3 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold leading-4 text-white">{movie.title}</h2>
                      </div>
                      <Trash2 className="mt-0.5 h-3.5 w-3.5 text-gray-500" />
                    </div>

                    <p className="min-h-[72px] text-[11px] leading-4 text-gray-400">{movie.synopsis}</p>

                    <button
                      type="button"
                      onClick={() => openEditMovie(movie)}
                      className="w-full rounded bg-[#304631] px-4 py-1.5 text-[10px] font-semibold text-emerald-300 transition hover:bg-[#3a573d]"
                    >
                      แก้ไข
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={openAddMovie}
              className="fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#58dc69] text-[#061008] shadow-[0_0_24px_rgba(88,220,105,0.45)] transition hover:bg-[#73e581]"
            >
              <Plus className="h-7 w-7" />
            </button>

            {filteredMovies.length === 0 ? (
              <div className="mt-6 rounded-[12px] border border-dashed border-[#244129] bg-[#0d1510] px-6 py-10 text-center text-sm text-gray-500">
                No movies match your search.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(13,41,24,0.92),_rgba(7,15,10,1)_58%)] px-6 py-8 text-gray-100 xl:px-8">
      <section className="mx-auto w-full max-w-[1320px] rounded-[26px] border border-[#173322] bg-[#08110b]/95 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
        <div className="border-b border-[#13311f] px-6 py-5">
          <button
            type="button"
            onClick={goBackToList}
            className="flex items-center gap-3 text-emerald-400 transition hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-semibold">Back</span>
          </button>

          <div className="mt-4">
            <p className="text-sm font-medium text-emerald-500">EMERALD CINEMA</p>
            <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Projection Booth V2.0
            </p>
          </div>

          <h2 className="mt-8 text-3xl font-medium text-white">
            {mode === 'add' ? 'เพิ่มภาพยนตร์ใหม่ (Add New Movie)' : 'แก้ไขข้อมูลภาพยนตร์ (Edit Movie)'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="relative px-6 pb-24 pt-6">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="space-y-4">
              <div className="flex h-[250px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#47624b] bg-[#2f4132]/35 text-center">
                {hasPoster ? (
                  <img
                    src={draft.poster}
                    alt={draft.title || 'Poster preview'}
                    className="h-full w-full rounded-[8px] object-cover"
                  />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5d745f] text-[#9bb099]">
                      <Camera className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-300">
                      Upload Picture
                    </p>
                    <p className="mt-2 text-[10px] text-gray-500">Use 1000 x 1500 px</p>
                  </>
                )}
              </div>

              <p className="text-center text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Poster preview dimension 2:3
              </p>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                  Movie Name
                </span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Enter movie title..."
                  className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-[1fr_140px]">
                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Movie ID
                  </span>
                  <input
                    value={draft.id}
                    onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value }))}
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-emerald-300 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Rating
                  </span>
                  <div className="flex items-center gap-2 rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3">
                    <input
                      value={draft.rating}
                      onChange={(event) => setDraft((current) => ({ ...current, rating: event.target.value }))}
                      className="w-full bg-transparent text-sm text-white outline-none"
                    />
                    <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                    <span className="text-[10px] text-gray-400">/ 10</span>
                  </div>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Release Date
                  </span>
                  <input
                    type="date"
                    value={draft.releaseDate}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, releaseDate: event.target.value }))
                    }
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Genre
                  </span>
                  <input
                    value={draft.genre}
                    onChange={(event) => setDraft((current) => ({ ...current, genre: event.target.value }))}
                    placeholder="Action"
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                  Duration
                </span>
                <input
                  value={draft.duration}
                  onChange={(event) => setDraft((current) => ({ ...current, duration: event.target.value }))}
                  placeholder="e.g., 2h 15m"
                  className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                  Poster URL
                </span>
                <input
                  value={draft.poster}
                  onChange={(event) => setDraft((current) => ({ ...current, poster: event.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                  Description
                </span>
                <textarea
                  value={draft.synopsis}
                  onChange={(event) => setDraft((current) => ({ ...current, synopsis: event.target.value }))}
                  placeholder="Write movie synopsis..."
                  rows={5}
                  className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                />
              </label>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#58dc69] px-6 py-3 text-sm font-semibold text-[#061008] shadow-[0_0_20px_rgba(88,220,105,0.35)] transition hover:bg-[#74e482]"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
