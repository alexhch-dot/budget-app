import { useBudget } from '../context/BudgetContext'
import BudgetSettings from '../components/Settings/BudgetSettings'
import RulesSettings from '../components/Settings/RulesSettings'
import ProfileSettings from '../components/Settings/ProfileSettings'

export default function SettingsPage() {
  const {
    categories,
    budgets,
    setBudget,
    rules,
    addRule,
    updateRule,
    deleteRule,
    reapplyAllRules,
    profile,
    setProfile,
  } = useBudget()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Paramètres</h1>
      <BudgetSettings
        categories={categories}
        budgets={budgets}
        onSetBudget={(category, value) => setBudget(category, value === '' ? '' : Number(value))}
      />
      <RulesSettings
        rules={rules}
        categories={categories}
        onAdd={addRule}
        onUpdate={updateRule}
        onDelete={deleteRule}
        onReapply={reapplyAllRules}
      />
      <ProfileSettings profile={profile} onChange={setProfile} />
    </div>
  )
}
