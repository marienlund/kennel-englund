-- ============================================
-- Kennel Team Englund - Supabase Database Schema
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'visitor' check (role in ('admin', 'visitor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'visitor');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper function to check admin role
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- DOGS
-- ============================================
create table public.dogs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  gender text not null check (gender in ('male', 'female')),
  birthdate date,
  sire_name text,
  dam_name text,
  hd_score text,
  ad_score text,
  ocd_status text,
  mental_description text,
  training_results text,
  achievements text,
  extra_info text,
  working_dog_url text,
  video_url text,
  photo_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dogs enable row level security;

create policy "Dogs are viewable by everyone"
  on public.dogs for select using (true);

create policy "Admins can insert dogs"
  on public.dogs for insert with check (public.is_admin());

create policy "Admins can update dogs"
  on public.dogs for update using (public.is_admin());

create policy "Admins can delete dogs"
  on public.dogs for delete using (public.is_admin());

-- ============================================
-- DOG PHOTOS
-- ============================================
create table public.dog_photos (
  id uuid primary key default uuid_generate_v4(),
  dog_id uuid not null references public.dogs on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.dog_photos enable row level security;

create policy "Dog photos are viewable by everyone"
  on public.dog_photos for select using (true);

create policy "Admins can insert dog photos"
  on public.dog_photos for insert with check (public.is_admin());

create policy "Admins can update dog photos"
  on public.dog_photos for update using (public.is_admin());

create policy "Admins can delete dog photos"
  on public.dog_photos for delete using (public.is_admin());

-- ============================================
-- LITTERS
-- ============================================
create table public.litters (
  id uuid primary key default uuid_generate_v4(),
  sire_name text not null,
  dam_name text not null,
  birth_date date,
  males_count integer not null default 0,
  females_count integer not null default 0,
  available boolean not null default true,
  description text,
  created_at timestamptz not null default now()
);

alter table public.litters enable row level security;

create policy "Litters are viewable by everyone"
  on public.litters for select using (true);

create policy "Admins can insert litters"
  on public.litters for insert with check (public.is_admin());

create policy "Admins can update litters"
  on public.litters for update using (public.is_admin());

create policy "Admins can delete litters"
  on public.litters for delete using (public.is_admin());

-- ============================================
-- LITTER PHOTOS
-- ============================================
create table public.litter_photos (
  id uuid primary key default uuid_generate_v4(),
  litter_id uuid not null references public.litters on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.litter_photos enable row level security;

create policy "Litter photos are viewable by everyone"
  on public.litter_photos for select using (true);

create policy "Admins can insert litter photos"
  on public.litter_photos for insert with check (public.is_admin());

create policy "Admins can update litter photos"
  on public.litter_photos for update using (public.is_admin());

create policy "Admins can delete litter photos"
  on public.litter_photos for delete using (public.is_admin());

-- ============================================
-- NEWS
-- ============================================
create table public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  photo_path text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.news enable row level security;

create policy "News is viewable by everyone"
  on public.news for select using (true);

create policy "Admins can insert news"
  on public.news for insert with check (public.is_admin());

create policy "Admins can update news"
  on public.news for update using (public.is_admin());

create policy "Admins can delete news"
  on public.news for delete using (public.is_admin());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true);

-- Storage policies
create policy "Anyone can view dog photos"
  on storage.objects for select
  using (bucket_id = 'dog-photos');

create policy "Admins can upload dog photos"
  on storage.objects for insert
  with check (bucket_id = 'dog-photos' and public.is_admin());

create policy "Admins can update dog photos"
  on storage.objects for update
  using (bucket_id = 'dog-photos' and public.is_admin());

create policy "Admins can delete dog photos"
  on storage.objects for delete
  using (bucket_id = 'dog-photos' and public.is_admin());

-- ============================================
-- MOCK DATA
-- ============================================
insert into public.dogs (id, name, gender, birthdate, sire_name, dam_name, hd_score, ad_score, ocd_status, mental_description, training_results, achievements, is_featured) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Donja vom Haus Englund', 'female', '2020-03-15', 'Rex von der Schiffslache', 'Bella vom Haus Englund', 'HD-A', 'AD 0/0', 'Fri', 'Rolig, selvsikker og meget kontaktsøgende. Viser ingen tegn på skyhed eller nervøsitet. Fremragende i nye miljøer.', 'BH/VT bestået med rosende bemærkninger. IPO1 med 285 point. Sporhund klasse 2.', 'V1 på Bundessieger 2022. Avlskåret med KKL1. Bedste tæve på klubskuet 2021.', true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Rex vom Haus Englund', 'male', '2019-06-22', 'Aro vom Grafental', 'Cira vom Haus Englund', 'HD-A', 'AD 0/0', 'Fri', 'Kraftfuld, harmonisk og meget arbejdsvillig. Stærk nervesystem og fremragende hårdhed. Klar og tydelig i sit væsen.', 'IPO3 med 292 point. FH2 bestået. BH/VT. Sporhund klasse 3.', 'VA på Bundessieger 2021. 2x V1 specialudstilling. Avlskåret KKL1. Landsmester spor 2023.', true),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Gina vom Haus Englund', 'female', '2022-01-10', 'Rex vom Haus Englund', 'Donja vom Haus Englund', 'HD-A', 'AD 0/0', 'Fri', 'Livlig og opmærksom med stærk drift. Meget social og tryg i alle situationer. Viser stor selvtillid.', 'BH/VT bestået. IPO1 med 280 point.', 'V1 ungdomsklasse på DM 2023. Mest lovende unghund 2023.', true),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Atos vom Haus Englund', 'male', '2021-09-05', 'Rex vom Haus Englund', 'Bella vom Haus Englund', 'HD-B', 'AD 0/0', 'Fri', 'Venlig, åben og meget menneskeorienteret. God nervekontrol og fin balance mellem ro og aktivitet.', 'BH/VT bestået. IPO2 med 275 point. Sporhund klasse 1.', 'V2 åben klasse på klubskuet 2023. Godkendt avlshan.', false);

insert into public.litters (id, sire_name, dam_name, birth_date, males_count, females_count, available, description) values
  ('b1b2c3d4-0001-4000-8000-000000000001', 'Rex vom Haus Englund', 'Donja vom Haus Englund', '2025-04-20', 4, 3, true, 'Fantastisk kuld med 7 sunde og livlige hvalpe. Begge forældre er HD-A og mentalt beskrevne med fremragende resultater. Hvalpene er opdrættet i hjemmet med tidlig stimulering og socialisering. 2 hanner og 1 tæve er stadig ledige.'),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'Atos vom Haus Englund', 'Gina vom Haus Englund', null, 0, 0, false, 'Vi planlægger et nyt kuld til efteråret 2025. Gina vil blive parret med Atos for en spændende kombination af arbejdsevne og fantastisk mentalitet. Kontakt os for at komme på ventelisten.');

insert into public.news (id, title, content, photo_path, published_at) values
  ('c1b2c3d4-0001-4000-8000-000000000001', 'Rex opnår VA på Bundessieger!', 'Vi er utroligt stolte over at vores Rex vom Haus Englund har opnået den fornemme VA-placering (Vorzüglich Auslese) på årets Bundessieger i Nürnberg. Det er en enorm anerkendelse af hans kvalitet som avlshan og en milepæl for vores kennel. Rex viste sig fra sin bedste side med fantastisk bevægelse og temperament. Tak til alle der hepper på os!', null, '2025-05-15'),
  ('c1b2c3d4-0002-4000-8000-000000000002', 'Nye hvalpe er født!', 'Den 20. april blev vi velsignet med et smukt kuld på 7 hvalpe fra Rex og Donja. 4 hanner og 3 tæver, alle sunde og stærke. Moderen har det fantastisk og hvalpene vokser som ukrudt. Vi begynder med besøgstider fra uge 5. Kontakt os hvis du er interesseret.', null, '2025-04-20'),
  ('c1b2c3d4-0003-4000-8000-000000000003', 'Gina bestod IPO1 med bravur', 'Vores unge Gina vom Haus Englund bestod i dag sin IPO1-prøve med imponerende 280 point. Hun viste sig særligt stærk i spordisciplinen med 96 point. Vi er meget tilfredse med hendes udvikling og ser frem til næste trin i hendes uddannelse.', null, '2025-03-10');
