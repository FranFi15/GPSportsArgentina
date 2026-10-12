const countryList = [
  { code: 'AF', es: 'Afganistán', en: 'Afghanistan' },
  { code: 'AL', es: 'Albania', en: 'Albania' },
  { code: 'DE', es: 'Alemania', en: 'Germany', aliases: ['aleman', 'alemana'] },
  { code: 'AO', es: 'Angola', en: 'Angola', aliases: ['angoleno', 'angoleño'] },
  { code: 'SA', es: 'Arabia Saudita', en: 'Saudi Arabia' },
  { code: 'DZ', es: 'Argelia', en: 'Algeria' },
  { code: 'AR', es: 'Argentina', en: 'Argentina', aliases: ['argentino', 'argentina'] },
  { code: 'AM', es: 'Armenia', en: 'Armenia' },
  { code: 'AU', es: 'Australia', en: 'Australia', aliases: ['australiano', 'australiana'] },
  { code: 'AT', es: 'Austria', en: 'Austria', aliases: ['austriaco', 'austriaca'] },
  { code: 'BE', es: 'Bélgica', en: 'Belgium', aliases: ['belga'] },
  { code: 'BO', es: 'Bolivia', en: 'Bolivia', aliases: ['boliviano', 'boliviana'] },
  { code: 'BA', es: 'Bosnia y Herzegovina', en: 'Bosnia and Herzegovina', aliases: ['bosnio', 'bosnia'] },
  { code: 'BR', es: 'Brasil', en: 'Brazil', aliases: ['brasileno', 'brasileño', 'brasileiro', 'brasilera'] },
  { code: 'BG', es: 'Bulgaria', en: 'Bulgaria', aliases: ['bulgaro', 'búlgaro'] },
  { code: 'CV', es: 'Cabo Verde', en: 'Cape Verde', aliases: ['caboverdiano'] },
  { code: 'CM', es: 'Camerún', en: 'Cameroon', aliases: ['camerunes'] },
  { code: 'CA', es: 'Canadá', en: 'Canada', aliases: ['canadiense'] },
  { code: 'CL', es: 'Chile', en: 'Chile', aliases: ['chileno', 'chilena'] },
  { code: 'CN', es: 'China', en: 'China', aliases: ['chino', 'china'] },
  { code: 'CO', es: 'Colombia', en: 'Colombia', aliases: ['colombiano', 'colombiana'] },
  { code: 'KR', es: 'Corea del Sur', en: 'South Korea', aliases: ['coreano', 'coreana'] },
  { code: 'CI', es: 'Costa de Marfil', en: 'Ivory Coast', aliases: ['marfileño', 'marfileno'] },
  { code: 'CR', es: 'Costa Rica', en: 'Costa Rica', aliases: ['costarricense'] },
  { code: 'HR', es: 'Croacia', en: 'Croatia', aliases: ['croata'] },
  { code: 'CU', es: 'Cuba', en: 'Cuba', aliases: ['cubano', 'cubana'] },
  { code: 'DK', es: 'Dinamarca', en: 'Denmark', aliases: ['danes', 'danés'] },
  { code: 'EC', es: 'Ecuador', en: 'Ecuador', aliases: ['ecuatoriano', 'ecuatoriana'] },
  { code: 'EG', es: 'Egipto', en: 'Egypt', aliases: ['egipcio', 'egipcia'] },
  { code: 'SV', es: 'El Salvador', en: 'El Salvador', aliases: ['salvadoreno', 'salvadoreño'] },
  { code: 'SK', es: 'Eslovaquia', en: 'Slovakia', aliases: ['eslovaco', 'eslovaca'] },
  { code: 'SI', es: 'Eslovenia', en: 'Slovenia', aliases: ['esloveno', 'eslovena'] },
  { code: 'ES', es: 'España', en: 'Spain', aliases: ['espanol', 'español', 'espanola', 'española', 'spain'] },
  { code: 'US', es: 'Estados Unidos', en: 'United States', aliases: ['estadounidense', 'eeuu', 'ee.uu.', 'usa', 'united states'] },
  { code: 'EE', es: 'Estonia', en: 'Estonia' },
  { code: 'PH', es: 'Filipinas', en: 'Philippines', aliases: ['filipino', 'filipina'] },
  { code: 'FI', es: 'Finlandia', en: 'Finland', aliases: ['finlandes', 'finlandés'] },
  { code: 'FR', es: 'Francia', en: 'France', aliases: ['frances', 'francés', 'francesa'] },
  { code: 'GE', es: 'Georgia', en: 'Georgia', aliases: ['georgiano', 'georgiana'] },
  { code: 'GR', es: 'Grecia', en: 'Greece', aliases: ['griego', 'griega'] },
  { code: 'GT', es: 'Guatemala', en: 'Guatemala', aliases: ['guatemalteco', 'guatemalteca'] },
  { code: 'HN', es: 'Honduras', en: 'Honduras', aliases: ['hondureno', 'hondureño'] },
  { code: 'HU', es: 'Hungría', en: 'Hungary', aliases: ['hungaro', 'húngaro'] },
  { code: 'IN', es: 'India', en: 'India' },
  { code: 'IE', es: 'Irlanda', en: 'Ireland', aliases: ['irlandes', 'irlandés'] },
  { code: 'IS', es: 'Islandia', en: 'Iceland' },
  { code: 'IL', es: 'Israel', en: 'Israel', aliases: ['israeli', 'israelí'] },
  { code: 'IT', es: 'Italia', en: 'Italy', aliases: ['italiano', 'italiana'] },
  { code: 'JM', es: 'Jamaica', en: 'Jamaica', aliases: ['jamaicano', 'jamaicana'] },
  { code: 'JP', es: 'Japón', en: 'Japan', aliases: ['japones', 'japonés'] },
  { code: 'LV', es: 'Letonia', en: 'Latvia', aliases: ['leton', 'letón'] },
  { code: 'LT', es: 'Lituania', en: 'Lithuania', aliases: ['lituano', 'lituana'] },
  { code: 'MK', es: 'Macedonia del Norte', en: 'North Macedonia' },
  { code: 'MA', es: 'Marruecos', en: 'Morocco', aliases: ['marroqui', 'marroquí'] },
  { code: 'MX', es: 'México', en: 'Mexico', aliases: ['mexicano', 'mexicana'] },
  { code: 'ME', es: 'Montenegro', en: 'Montenegro', aliases: ['montenegrino'] },
  { code: 'NG', es: 'Nigeria', en: 'Nigeria', aliases: ['nigeriano', 'nigeriana'] },
  { code: 'NO', es: 'Noruega', en: 'Norway', aliases: ['noruego', 'noruega'] },
  { code: 'NZ', es: 'Nueva Zelanda', en: 'New Zealand' },
  { code: 'NL', es: 'Países Bajos', en: 'Netherlands', aliases: ['holandes', 'holandés', 'neerlandes'] },
  { code: 'PA', es: 'Panamá', en: 'Panama', aliases: ['panameno', 'panameño'] },
  { code: 'PY', es: 'Paraguay', en: 'Paraguay', aliases: ['paraguayo', 'paraguaya'] },
  { code: 'PE', es: 'Perú', en: 'Peru', aliases: ['peruano', 'peruana'] },
  { code: 'PL', es: 'Polonia', en: 'Poland', aliases: ['polaco', 'polaca'] },
  { code: 'PT', es: 'Portugal', en: 'Portugal', aliases: ['portugues', 'portugués'] },
  { code: 'PR', es: 'Puerto Rico', en: 'Puerto Rico', aliases: ['puertorriqueno', 'puertorriqueño'] },
  { code: 'GB', es: 'Reino Unido', en: 'United Kingdom', aliases: ['britanico', 'británico', 'ingles', 'inglés'] },
  { code: 'CZ', es: 'República Checa', en: 'Czech Republic', aliases: ['checo', 'checa'] },
  { code: 'DO', es: 'República Dominicana', en: 'Dominican Republic', aliases: ['dominicano', 'dominicana'] },
  { code: 'RO', es: 'Rumania', en: 'Romania', aliases: ['rumano', 'rumana'] },
  { code: 'RU', es: 'Rusia', en: 'Russia', aliases: ['ruso', 'rusa'] },
  { code: 'SN', es: 'Senegal', en: 'Senegal', aliases: ['senegales'] },
  { code: 'RS', es: 'Serbia', en: 'Serbia', aliases: ['serbio', 'serbia'] },
  { code: 'ZA', es: 'Sudáfrica', en: 'South Africa', aliases: ['sudafricano'] },
  { code: 'SE', es: 'Suecia', en: 'Sweden', aliases: ['sueco', 'sueca'] },
  { code: 'CH', es: 'Suiza', en: 'Switzerland', aliases: ['suizo', 'suiza'] },
  { code: 'TN', es: 'Túnez', en: 'Tunisia', aliases: ['tunecino'] },
  { code: 'TR', es: 'Turquía', en: 'Turkey', aliases: ['turco', 'turca'] },
  { code: 'UA', es: 'Ucrania', en: 'Ukraine', aliases: ['ucraniano', 'ucraniana'] },
  { code: 'UY', es: 'Uruguay', en: 'Uruguay', aliases: ['uruguayo', 'uruguaya'] },
  { code: 'VE', es: 'Venezuela', en: 'Venezuela', aliases: ['venezolano', 'venezolana'] },
];

const fold = (value) => String(value)
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export const countries = [...countryList].sort((a, b) => a.es.localeCompare(b.es, 'es'));

export function countryFromValue(value) {
  if (!value || Array.isArray(value)) return null;
  const key = fold(value);
  return countries.find((country) => {
    const names = [country.code, country.es, country.en, ...(country.aliases || [])];
    return names.some((name) => fold(name) === key);
  }) || null;
}

export function countriesFromValue(value) {
  const raw = Array.isArray(value) ? value : String(value || '').split(/[,;/|]/);
  const selected = [];
  raw.forEach((item) => {
    const country = countryFromValue(item);
    if (country && !selected.some((entry) => entry.code === country.code)) {
      selected.push(country);
    }
  });
  return selected;
}

export function flagSrc(code, width = 80) {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}
