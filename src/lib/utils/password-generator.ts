// Password generator utility using word lists

const adjectives = [
  // Nature & Weather
  'Happy', 'Bright', 'Swift', 'Clever', 'Brave', 'Calm', 'Wise', 'Bold', 'Kind', 'Smart',
  'Quick', 'Strong', 'Gentle', 'Wild', 'Quiet', 'Lively', 'Noble', 'Proud', 'Sweet', 'Fresh',
  'Royal', 'Golden', 'Silver', 'Crystal', 'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Amber',
  'Cosmic', 'Solar', 'Lunar', 'Stellar', 'Galactic', 'Mystic', 'Magic', 'Ancient', 'Eternal', 'Divine',
  'Ocean', 'Mountain', 'Forest', 'Desert', 'Arctic', 'Tropical', 'Alpine', 'Coastal', 'Rural', 'Urban',
  'Spring', 'Summer', 'Autumn', 'Winter', 'Morning', 'Evening', 'Dawn', 'Dusk', 'Midnight', 'Sunrise',
  'Flying', 'Running', 'Dancing', 'Singing', 'Dreaming', 'Soaring', 'Floating', 'Gliding', 'Sailing', 'Racing',
  'Hidden', 'Secret', 'Mystic', 'Sacred', 'Rare', 'Unique', 'Special', 'Precious', 'Valuable', 'Priceless',
];

const nouns = [
  // Animals & Creatures
  'Tiger', 'Eagle', 'River', 'Ocean', 'Mountain', 'Forest', 'Star', 'Moon', 'Sun', 'Cloud',
  'Dragon', 'Phoenix', 'Lion', 'Wolf', 'Bear', 'Hawk', 'Falcon', 'Dolphin', 'Whale', 'Shark',
  'Crystal', 'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Amber', 'Jade', 'Opal', 'Topaz',
  'Comet', 'Nova', 'Nebula', 'Galaxy', 'Cosmos', 'Orbit', 'Zenith', 'Nadir', 'Horizon', 'Voyage',
  'Cascade', 'Fountain', 'Spring', 'Stream', 'Lake', 'Valley', 'Canyon', 'Meadow', 'Garden', 'Orchard',
  'Thunder', 'Lightning', 'Aurora', 'Rainbow', 'Sunset', 'Dawn', 'Dusk', 'Twilight', 'Midnight', 'Sunrise',
  'Symphony', 'Melody', 'Harmony', 'Rhythm', 'Cadence', 'Sonata', 'Concerto', 'Opera', 'Ballad', 'Chorus',
  'Phoenix', 'Griffin', 'Pegasus', 'Unicorn', 'Mermaid', 'Sphinx', 'Centaur', 'Dragon', 'Kraken', 'Leviathan',
];

const specialChars = ['!', '@', '#', '$', '%', '&', '*'];

const numbers = [
  // Simple sequences
  '123', '456', '789', '234', '567', '890',
  // Repeating patterns
  '111', '222', '333', '444', '555', '666', '777', '888', '999', '000',
  // Year-based
  '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015',
];

/**
 * Generates a secure, memorable password
 * Format: Adjective + Noun + Number + SpecialChar
 * Example: BrightDragon2024!
 */
export function generatePassword(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];

  return `${adjective}${noun}${number}${specialChar}`;
}

