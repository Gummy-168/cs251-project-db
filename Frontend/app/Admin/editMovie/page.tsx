'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Camera, Plus, Save, Search, Star, Trash2 } from 'lucide-react';
import type { MovieCard } from '@/types/movie';

import {
  createAdminMovie,
  deleteAdminMovie,
  getMovies,
  updateAdminMovie,
} from '@/services/api';

type Movie = {
  id: number;
  title: string;
  rating: string;
  synopsis: string;
  poster: string;
  releaseDate: string;
  genre: string;
  duration: string;
  ageRating: string;
  actor: string;
  director: string;
};

const ADMIN_ID = 1;

const emptyMovie: Movie = {
  id: 0,
  title: '',
  rating: '0.0',
  synopsis: '',
  poster: '',
  releaseDate: '',
  genre: '',
  duration: '',
  ageRating: '',
  actor: '',
  director: '',
};

function mapToEditableMovie(movie: MovieCard): Movie {
  return {
    id: movie.id,
    title: movie.title,
    rating: movie.scoreRating !== null ? String(movie.scoreRating) : '0.0',
    synopsis: movie.description ?? '',
    poster: movie.image,
    releaseDate: movie.releaseDate,
    genre: movie.genre,
    duration: String(movie.duration),
    ageRating: movie.ageRating,
    actor: '',
    director: '',
  };
}

export default function EditMoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Movie>(emptyMovie);
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list');
  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getMovies();
      setMovies(data.map(mapToEditableMovie));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'โหลดข้อมูลภาพยนตร์ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) =>
      [movie.title, String(movie.id), movie.genre, movie.synopsis].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [movies, query]);

  const openEditMovie = (movie: Movie) => {
    setDraft(movie);
    setMode('edit');
    setSavedMessage('');
    setErrorMessage('');
  };

  const openAddMovie = () => {
    setDraft({
      ...emptyMovie,
      rating: '8.0',
      ageRating: 'PG-13',
    });
    setMode('add');
    setSavedMessage('');
    setErrorMessage('');
  };

  const goBackToList = () => {
    setMode('list');
    setSavedMessage('');
    setErrorMessage('');
  };

  const handleDeleteMovie = async (movieId: number) => {
    const isConfirmed = window.confirm('ยืนยันการลบภาพยนตร์รายการนี้?');
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteAdminMovie(movieId);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));
      setSavedMessage(`ลบภาพยนตร์ ID ${movieId} เรียบร้อยแล้ว`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'ลบภาพยนตร์ไม่สำเร็จ');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = draft.title.trim();
    const genre = draft.genre.trim();
    const ageRating = draft.ageRating.trim();
    const releaseDate = draft.releaseDate.trim();
    const duration = Number(draft.duration);
    const rating = Number(draft.rating);

    if (!title || !genre || !ageRating || !releaseDate || !Number.isFinite(duration) || duration <= 0) {
      setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่อเรื่อง, หมวดหมู่, อายุผู้ชม, วันฉาย, ความยาวนาที)');
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      setErrorMessage('คะแนนต้องอยู่ระหว่าง 0 ถึง 10');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      if (mode === 'add') {
        await createAdminMovie({
          MName: title,
          Genre: genre,
          Duration: Math.round(duration),
          AgeRating: ageRating,
          Description: draft.synopsis.trim() || null,
          ReleaseDate: releaseDate,
          Actor: draft.actor.trim() || null,
          Director: draft.director.trim() || null,
          ScoreRating: Number(rating.toFixed(1)),
          AID: ADMIN_ID,
        });
        setSavedMessage(`เพิ่ม "${title}" เรียบร้อยแล้ว`);
      } else {
        const payload: {
          MName: string;
          Genre: string;
          Duration: number;
          AgeRating: string;
          Description: string | null;
          ReleaseDate: string;
          ScoreRating: number;
          Actor?: string | null;
          Director?: string | null;
        } = {
          MName: title,
          Genre: genre,
          Duration: Math.round(duration),
          AgeRating: ageRating,
          Description: draft.synopsis.trim() || null,
          ReleaseDate: releaseDate,
          ScoreRating: Number(rating.toFixed(1)),
        };

        if (draft.actor.trim()) {
          payload.Actor = draft.actor.trim();
        }

        if (draft.director.trim()) {
          payload.Director = draft.director.trim();
        }

        await updateAdminMovie(draft.id, payload);
        setSavedMessage(`บันทึกการแก้ไข "${title}" เรียบร้อยแล้ว`);
      }

      await loadMovies();
      setMode('list');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
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
            {errorMessage ? <p className="mb-4 text-sm text-rose-400">{errorMessage}</p> : null}
            {loading ? <p className="mb-4 text-sm text-gray-400">กำลังโหลดข้อมูลภาพยนตร์...</p> : null}

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
                      <button
                        type="button"
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="text-gray-500 transition hover:text-red-400"
                      >
                        <Trash2 className="mt-0.5 h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="min-h-[72px] text-[11px] leading-4 text-gray-400">{movie.synopsis || '-'}</p>

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

            {!loading && filteredMovies.length === 0 ? (
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
          {errorMessage ? <p className="mt-4 text-sm text-rose-400">{errorMessage}</p> : null}
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
                    value={draft.id === 0 ? 'Auto' : String(draft.id)}
                    disabled
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/70 px-4 py-3 text-sm text-emerald-300 outline-none"
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

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Duration (minutes)
                  </span>
                  <input
                    value={draft.duration}
                    onChange={(event) => setDraft((current) => ({ ...current, duration: event.target.value }))}
                    placeholder="e.g., 125"
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Age Rating
                  </span>
                  <input
                    value={draft.ageRating}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, ageRating: event.target.value }))
                    }
                    placeholder="PG-13"
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Actors (comma separated)
                  </span>
                  <input
                    value={draft.actor}
                    onChange={(event) => setDraft((current) => ({ ...current, actor: event.target.value }))}
                    placeholder="Actor A, Actor B"
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                    Director
                  </span>
                  <input
                    value={draft.director}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, director: event.target.value }))
                    }
                    placeholder="Director name"
                    className="w-full rounded-[6px] border border-[#2b3d2e] bg-[#4a5e4a]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-300/50 focus:border-emerald-500"
                  />
                </label>
              </div>

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
              disabled={submitting}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-[0_0_20px_rgba(88,220,105,0.35)] transition ${
                submitting
                  ? 'cursor-not-allowed bg-[#4a5e4a] text-[#9eb39f]'
                  : 'bg-[#58dc69] text-[#061008] hover:bg-[#74e482]'
              }`}
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
