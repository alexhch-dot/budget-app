const COUNTRIES = ['France', 'Espagne', 'Belgique', 'Suisse', 'Autre']

export default function ProfileSettings({ profile, onChange }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Profil</h2>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-gray-700">Pays de résidence</span>
        <select
          value={profile.country}
          onChange={(e) => onChange({ country: e.target.value })}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Utilisé en V2 pour la détection automatique des dépenses de voyage.
      </p>
    </section>
  )
}
