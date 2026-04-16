export interface Celebrity {
  id: number;
  name: string;
  profession: "actor" | "musician" | "athlete" | "other";
  nationality: string;
  gender: "male" | "female";
  image: string;
  hint: string;
}

// Curated list of globally recognizable celebrities
// Images use Wikipedia/Wikimedia Commons URLs (public domain / CC licensed)
const celebrities: Celebrity[] = [
  // === ACTORS (30%) ===
  {
    id: 1,
    name: "Leonardo DiCaprio",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/1.jpg",
    hint: "Known for Titanic and The Revenant",
  },
  {
    id: 2,
    name: "Meryl Streep",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/2.jpg",
    hint: "Most Oscar-nominated actor in history",
  },
  {
    id: 3,
    name: "Tom Hanks",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/3.jpg",
    hint: "Starred in Forrest Gump and Cast Away",
  },
  {
    id: 4,
    name: "Scarlett Johansson",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/4.jpg",
    hint: "Black Widow in the MCU",
  },
  {
    id: 5,
    name: "Morgan Freeman",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/5.jpg",
    hint: "Famous narrator voice, starred in Shawshank Redemption",
  },
  {
    id: 6,
    name: "Angelina Jolie",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/6.jpg",
    hint: "Lara Croft actress and UN ambassador",
  },
  {
    id: 7,
    name: "Robert Downey Jr.",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/7.jpg",
    hint: "Iron Man in the MCU",
  },
  {
    id: 8,
    name: "Emma Watson",
    profession: "actor",
    nationality: "British",
    gender: "female",
    image: "/celebrities/8.jpg",
    hint: "Hermione Granger in Harry Potter",
  },
  {
    id: 9,
    name: "Dwayne Johnson",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/9.jpg",
    hint: "Also known as The Rock",
  },
  {
    id: 10,
    name: "Natalie Portman",
    profession: "actor",
    nationality: "Israeli-American",
    gender: "female",
    image: "/celebrities/10.jpg",
    hint: "Star Wars prequel trilogy and Black Swan",
  },
  {
    id: 11,
    name: "Brad Pitt",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/11.jpg",
    hint: "Fight Club and Once Upon a Time in Hollywood",
  },
  {
    id: 12,
    name: "Jennifer Lawrence",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/12.jpg",
    hint: "Katniss Everdeen in The Hunger Games",
  },
  {
    id: 13,
    name: "Will Smith",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/13.jpg",
    hint: "Fresh Prince and Men in Black star",
  },
  {
    id: 14,
    name: "Cate Blanchett",
    profession: "actor",
    nationality: "Australian",
    gender: "female",
    image: "/celebrities/14.jpg",
    hint: "Galadriel in Lord of the Rings",
  },
  {
    id: 15,
    name: "Keanu Reeves",
    profession: "actor",
    nationality: "Canadian",
    gender: "male",
    image: "/celebrities/15.jpg",
    hint: "Neo in The Matrix",
  },
  {
    id: 16,
    name: "Shah Rukh Khan",
    profession: "actor",
    nationality: "Indian",
    gender: "male",
    image: "/celebrities/16.jpg",
    hint: "King of Bollywood",
  },
  {
    id: 17,
    name: "Jackie Chan",
    profession: "actor",
    nationality: "Chinese",
    gender: "male",
    image: "/celebrities/17.jpg",
    hint: "Martial arts comedy legend",
  },
  {
    id: 18,
    name: "Gal Gadot",
    profession: "actor",
    nationality: "Israeli",
    gender: "female",
    image: "/celebrities/18.jpg",
    hint: "Wonder Woman in the DC universe",
  },
  // === MUSICIANS (25%) ===
  {
    id: 19,
    name: "Taylor Swift",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "/celebrities/19.jpg",
    hint: "Eras Tour and Shake It Off",
  },
  {
    id: 20,
    name: "Drake",
    profession: "musician",
    nationality: "Canadian",
    gender: "male",
    image: "/celebrities/20.jpg",
    hint: "Started from the Bottom rapper from Toronto",
  },
  {
    id: 21,
    name: "Beyoncé",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "/celebrities/21.jpg",
    hint: "Queen Bey, former Destiny's Child member",
  },
  {
    id: 22,
    name: "Ed Sheeran",
    profession: "musician",
    nationality: "British",
    gender: "male",
    image: "/celebrities/22.jpg",
    hint: "Shape of You and Perfect singer",
  },
  {
    id: 23,
    name: "Adele",
    profession: "musician",
    nationality: "British",
    gender: "female",
    image: "/celebrities/23.jpg",
    hint: "Rolling in the Deep and Hello singer",
  },
  {
    id: 24,
    name: "Eminem",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "/celebrities/24.jpg",
    hint: "Slim Shady, Lose Yourself rapper",
  },
  {
    id: 25,
    name: "Rihanna",
    profession: "musician",
    nationality: "Barbadian",
    gender: "female",
    image: "/celebrities/25.jpg",
    hint: "Umbrella singer and Fenty founder",
  },
  {
    id: 26,
    name: "Bruno Mars",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "/celebrities/26.jpg",
    hint: "Uptown Funk and 24K Magic singer",
  },
  {
    id: 27,
    name: "Lady Gaga",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "/celebrities/27.jpg",
    hint: "Poker Face and Born This Way artist",
  },
  {
    id: 28,
    name: "Kanye West",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "/celebrities/28.jpg",
    hint: "Yeezy, Gold Digger, fashion mogul",
  },
  {
    id: 29,
    name: "Billie Eilish",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "/celebrities/29.jpg",
    hint: "Bad Guy singer, youngest Grammy Album winner",
  },
  {
    id: 30,
    name: "Elton John",
    profession: "musician",
    nationality: "British",
    gender: "male",
    image: "/celebrities/30.jpg",
    hint: "Rocket Man and Your Song pianist",
  },
  {
    id: 31,
    name: "Shakira",
    profession: "musician",
    nationality: "Colombian",
    gender: "female",
    image: "/celebrities/31.jpg",
    hint: "Hips Don't Lie, Waka Waka singer",
  },
  {
    id: 32,
    name: "BTS (Jungkook)",
    profession: "musician",
    nationality: "South Korean",
    gender: "male",
    image: "/celebrities/32.jpg",
    hint: "K-pop global sensation, Dynamite group",
  },
  // === ATHLETES (25%) ===
  {
    id: 33,
    name: "Lionel Messi",
    profession: "athlete",
    nationality: "Argentine",
    gender: "male",
    image: "/celebrities/33.jpg",
    hint: "8-time Ballon d'Or winner, World Cup champion",
  },
  {
    id: 34,
    name: "Cristiano Ronaldo",
    profession: "athlete",
    nationality: "Portuguese",
    gender: "male",
    image: "/celebrities/34.jpg",
    hint: "CR7, most Instagram followers",
  },
  {
    id: 35,
    name: "Serena Williams",
    profession: "athlete",
    nationality: "American",
    gender: "female",
    image: "/celebrities/35.jpg",
    hint: "23 Grand Slam singles tennis champion",
  },
  {
    id: 36,
    name: "LeBron James",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "/celebrities/36.jpg",
    hint: "King James, 4-time NBA champion",
  },
  {
    id: 37,
    name: "Usain Bolt",
    profession: "athlete",
    nationality: "Jamaican",
    gender: "male",
    image: "/celebrities/37.jpg",
    hint: "Fastest man ever, Lightning Bolt pose",
  },
  {
    id: 38,
    name: "Neymar",
    profession: "athlete",
    nationality: "Brazilian",
    gender: "male",
    image: "/celebrities/38.jpg",
    hint: "Brazilian football star, PSG and Barcelona",
  },
  {
    id: 39,
    name: "Roger Federer",
    profession: "athlete",
    nationality: "Swiss",
    gender: "male",
    image: "/celebrities/39.jpg",
    hint: "20 Grand Slam tennis titles, Swiss maestro",
  },
  {
    id: 40,
    name: "Simone Biles",
    profession: "athlete",
    nationality: "American",
    gender: "female",
    image: "/celebrities/40.jpg",
    hint: "Most decorated gymnast in history",
  },
  {
    id: 41,
    name: "Michael Jordan",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "/celebrities/41.jpg",
    hint: "Air Jordan, 6-time NBA champion with Bulls",
  },
  {
    id: 42,
    name: "Virat Kohli",
    profession: "athlete",
    nationality: "Indian",
    gender: "male",
    image: "/celebrities/42.jpg",
    hint: "Indian cricket superstar",
  },
  {
    id: 43,
    name: "Kylian Mbappé",
    profession: "athlete",
    nationality: "French",
    gender: "male",
    image: "/celebrities/43.jpg",
    hint: "French football prodigy, Real Madrid star",
  },
  {
    id: 44,
    name: "Naomi Osaka",
    profession: "athlete",
    nationality: "Japanese",
    gender: "female",
    image: "/celebrities/44.jpg",
    hint: "4-time Grand Slam tennis champion from Japan",
  },
  {
    id: 45,
    name: "Lewis Hamilton",
    profession: "athlete",
    nationality: "British",
    gender: "male",
    image: "/celebrities/45.jpg",
    hint: "7-time F1 World Champion",
  },
  {
    id: 46,
    name: "Tom Brady",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "/celebrities/46.jpg",
    hint: "7-time Super Bowl champion quarterback",
  },
  // === OTHER (20%) - Politicians, Business, etc. ===
  {
    id: 47,
    name: "Elon Musk",
    profession: "other",
    nationality: "South African-American",
    gender: "male",
    image: "/celebrities/47.jpg",
    hint: "Tesla and SpaceX CEO",
  },
  {
    id: 48,
    name: "Oprah Winfrey",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "/celebrities/48.jpg",
    hint: "Queen of daytime TV, media mogul",
  },
  {
    id: 49,
    name: "Barack Obama",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "/celebrities/49.jpg",
    hint: "44th President of the United States",
  },
  {
    id: 50,
    name: "Malala Yousafzai",
    profession: "other",
    nationality: "Pakistani",
    gender: "female",
    image: "/celebrities/50.jpg",
    hint: "Youngest Nobel Peace Prize laureate",
  },
  {
    id: 51,
    name: "Jeff Bezos",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "/celebrities/51.jpg",
    hint: "Amazon founder and space entrepreneur",
  },
  {
    id: 52,
    name: "Kim Kardashian",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "/celebrities/52.jpg",
    hint: "Reality TV star and business mogul",
  },
  {
    id: 53,
    name: "Mark Zuckerberg",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "/celebrities/53.jpg",
    hint: "Facebook/Meta founder",
  },
  {
    id: 54,
    name: "Queen Elizabeth II",
    profession: "other",
    nationality: "British",
    gender: "female",
    image: "/celebrities/54.jpg",
    hint: "Longest-reigning British monarch",
  },
  {
    id: 55,
    name: "Gordon Ramsay",
    profession: "other",
    nationality: "British",
    gender: "male",
    image: "/celebrities/55.jpg",
    hint: "Hell's Kitchen celebrity chef",
  },
  {
    id: 56,
    name: "David Attenborough",
    profession: "other",
    nationality: "British",
    gender: "male",
    image: "/celebrities/56.jpg",
    hint: "Legendary nature documentary narrator",
  },
  {
    id: 57,
    name: "Michelle Obama",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "/celebrities/57.jpg",
    hint: "Former First Lady, Becoming author",
  },
  {
    id: 58,
    name: "Nelson Mandela",
    profession: "other",
    nationality: "South African",
    gender: "male",
    image: "/celebrities/58.jpg",
    hint: "Anti-apartheid icon, first Black president of South Africa",
  },
  // === MORE ACTORS ===
  {
    id: 59,
    name: "Zendaya",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/59.jpg",
    hint: "Euphoria and Spider-Man star",
  },
  {
    id: 60,
    name: "Chris Hemsworth",
    profession: "actor",
    nationality: "Australian",
    gender: "male",
    image: "/celebrities/60.jpg",
    hint: "Thor in the MCU",
  },
  {
    id: 61,
    name: "Denzel Washington",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "/celebrities/61.jpg",
    hint: "Training Day and The Equalizer star",
  },
  {
    id: 62,
    name: "Margot Robbie",
    profession: "actor",
    nationality: "Australian",
    gender: "female",
    image: "/celebrities/62.jpg",
    hint: "Barbie movie star and Harley Quinn",
  },
  // === MORE MUSICIANS ===
  {
    id: 63,
    name: "The Weeknd",
    profession: "musician",
    nationality: "Canadian",
    gender: "male",
    image: "/celebrities/63.jpg",
    hint: "Blinding Lights and Starboy singer",
  },
  {
    id: 64,
    name: "Ariana Grande",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "/celebrities/64.jpg",
    hint: "Thank U Next and 7 Rings singer",
  },
  {
    id: 65,
    name: "Post Malone",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "/celebrities/65.jpg",
    hint: "Rockstar and Sunflower rapper with face tattoos",
  },
  // === MORE ATHLETES ===
  {
    id: 66,
    name: "Stephen Curry",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "/celebrities/66.jpg",
    hint: "Greatest 3-point shooter, Golden State Warriors",
  },
  {
    id: 67,
    name: "Conor McGregor",
    profession: "athlete",
    nationality: "Irish",
    gender: "male",
    image: "/celebrities/67.jpg",
    hint: "Notorious UFC fighter from Dublin",
  },
  {
    id: 68,
    name: "Rafael Nadal",
    profession: "athlete",
    nationality: "Spanish",
    gender: "male",
    image: "/celebrities/68.jpg",
    hint: "King of Clay, 22 Grand Slam titles",
  },
  // === MORE OTHER ===
  {
    id: 69,
    name: "Bill Gates",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "/celebrities/69.jpg",
    hint: "Microsoft co-founder and philanthropist",
  },
  {
    id: 70,
    name: "Emma Stone",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "/celebrities/70.jpg",
    hint: "La La Land and Poor Things Oscar winner",
  },
];

export function getRandomCelebrities(count: number): Celebrity[] {
  const shuffled = [...celebrities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getCelebrityById(id: number): Celebrity | undefined {
  return celebrities.find((c) => c.id === id);
}

export function checkGuess(guess: string, celebrity: Celebrity): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  return normalize(guess) === normalize(celebrity.name);
}

// Levenshtein edit distance between two strings
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
}

// Returns similarity between guess and celebrity name in [0, 1]
export function guessSimilarity(guess: string, celebrity: Celebrity): number {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  const g = normalize(guess);
  const name = normalize(celebrity.name);
  if (g === name) return 1;
  const maxLen = Math.max(g.length, name.length);
  if (maxLen === 0) return 0;
  return 1 - levenshtein(g, name) / maxLen;
}

export default celebrities;
