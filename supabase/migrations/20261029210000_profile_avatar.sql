-- Optional profile avatar URL (Cloudinary or other HTTPS URL stored by the client).

alter table public.profiles
  add column if not exists avatar_url text;

comment on column public.profiles.avatar_url is
  'Optional public HTTPS URL for the user avatar. Null = show initials fallback.';
