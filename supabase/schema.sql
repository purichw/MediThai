-- Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  date_of_birth date,
  role text not null default 'patient' check (role in ('patient', 'admin', 'staff')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  doctor_name text,
  specialty text,
  hospital text not null,
  appointment_date date not null,
  appointment_time text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.appointments enable row level security;
create policy "Patients view own appointments" on public.appointments for select using (auth.uid() = patient_id);
create policy "Patients create appointments" on public.appointments for insert with check (auth.uid() = patient_id);
create policy "Admin view all appointments" on public.appointments for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'))
);
create policy "Admin update appointments" on public.appointments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'))
);
