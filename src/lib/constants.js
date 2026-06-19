import { v4 as uuidv4 } from 'uuid'

export const UNCATEGORIZED = 'Non catégorisé'

export const DEFAULT_CATEGORIES = [
  'Supermarché',
  'Abonnement',
  'Coiffeur/Santé',
  'Voyage',
  'Transport',
  'Sport',
  'Achat exceptionnel',
  'Loyer',
  'Bar',
  'Restaurant',
  'Café',
  'Prêt/Banque',
  'Virements émis',
  'CAF/Chômage',
  'Salaire',
  UNCATEGORIZED,
]

// Order matters: the first matching rule wins. Keeping "Abonnement" ahead of
// "Voyage" here is what makes a subscription charged while traveling stay an
// Abonnement instead of being reclassified as Voyage.
const KEYWORD_RULES_BY_CATEGORY = [
  ['Supermarché', ['DIA', 'SUPERMERCADO', 'BOULANGERIE', 'PANDA', 'MERCADONA', 'CARREFOUR', 'ALCAMPO', 'LIDL', 'ALDI', 'AUCHAN', 'PICARD']],
  ['Abonnement', ['ORANGE', 'DEEZER', 'MOBBIN', 'CURSOR']],
  ['Coiffeur/Santé', ['KEMI', 'SCULPTOR', 'PHARMACIE', 'FARMACIA', 'AROMAZONE', 'LEJEUNE', 'OH MY CREAM']],
  ['Voyage', ['AIRBNB', 'AIR EUROPA', 'IBERIA', 'DELTA', 'AIR FRANCE', 'MOJOSURF', 'GREET HOTEL']],
  ['Transport', ['RENFE', 'SNCF', 'APP CRTM', 'UBER', 'RATP', 'NAVIGO']],
  ['Sport', ['DEPORTES', 'DECATHLON']],
  ['Achat exceptionnel', ['FNAC', 'AMAZON', 'BILLETTERIE', 'LE COQ SPORTIF', 'NORAUTO', 'APPLE STORE']],
  ['Loyer', ['SPOTAHOME']],
  ['Bar', ['WAREHOUSE', 'COCKTAILPEZ', 'LA CHISPERIA', 'ANUBIS']],
  ['Restaurant', ['RAMEN', 'RESTAURANTE', 'TIKI TACO', 'TAVOLA']],
  ['Café', ['RODILLA', 'ESTUDIANTES', 'NESPRESSO']],
]

const POST_AMOUNT_KEYWORD_RULES_BY_CATEGORY = [
  ['Virements émis', ['RETRAIT DAB', 'REMISE CHEQUE']],
  ['CAF/Chômage', ['FRANCE TRAVAIL', 'CAF', 'CPAM']],
  ['Salaire', ['MYPASSPRO']],
]

function buildDefaultRules() {
  const rules = []
  for (const [category, keywords] of KEYWORD_RULES_BY_CATEGORY) {
    for (const keyword of keywords) {
      rules.push({ id: uuidv4(), type: 'keyword', keyword, category })
    }
  }
  rules.push({ id: uuidv4(), type: 'amount', amount: -1333.35, category: 'Prêt/Banque' })
  for (const [category, keywords] of POST_AMOUNT_KEYWORD_RULES_BY_CATEGORY) {
    for (const keyword of keywords) {
      rules.push({ id: uuidv4(), type: 'keyword', keyword, category })
    }
  }
  return rules
}

export const DEFAULT_RULES = buildDefaultRules()

export const AMOUNT_RANGES = {
  SMALL: 'petite dépense',
  LARGE: 'dépense 40€+',
  INCOME: 'entrée',
}

export const DEFAULT_PROFILE = {
  country: 'France',
}
