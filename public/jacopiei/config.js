// Dados ainda não definidos ficam nulos: nunca exibir links fictícios.
export const product = Object.freeze({
  name: 'JáCopiei?',
  usage: 'free-personal',
  release: {
    metadataUrl: 'https://raw.githubusercontent.com/Benfic4rthur/JaCopiei-Releases/main/latest.json',
    apiUrl: 'https://api.github.com/repos/Benfic4rthur/JaCopiei-Releases/releases',
    releasesUrl: 'https://github.com/Benfic4rthur/JaCopiei-Releases/releases',
    repositoryUrl: 'https://github.com/Benfic4rthur/JaCopiei-Releases',
  },
  siteUrl: 'https://allm4.com/jacopiei',
  contact: null,
  company: { name: 'Allm4', cnpj: null, address: null },
  links: { product: null, privacy: null, terms: null },
});
