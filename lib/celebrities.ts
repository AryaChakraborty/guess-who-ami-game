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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Leonardo_DiCaprio_2014.jpg/440px-Leonardo_DiCaprio_2014.jpg",
    hint: "Known for Titanic and The Revenant",
  },
  {
    id: 2,
    name: "Meryl Streep",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Meryl_Streep_December_2018.jpg/440px-Meryl_Streep_December_2018.jpg",
    hint: "Most Oscar-nominated actor in history",
  },
  {
    id: 3,
    name: "Tom Hanks",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg",
    hint: "Starred in Forrest Gump and Cast Away",
  },
  {
    id: 4,
    name: "Scarlett Johansson",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg/440px-Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg",
    hint: "Black Widow in the MCU",
  },
  {
    id: 5,
    name: "Morgan Freeman",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/440px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg",
    hint: "Famous narrator voice, starred in Shawshank Redemption",
  },
  {
    id: 6,
    name: "Angelina Jolie",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Angelina_Jolie_2_June_2014_%28cropped%29.jpg/440px-Angelina_Jolie_2_June_2014_%28cropped%29.jpg",
    hint: "Lara Croft actress and UN ambassador",
  },
  {
    id: 7,
    name: "Robert Downey Jr.",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",
    hint: "Iron Man in the MCU",
  },
  {
    id: 8,
    name: "Emma Watson",
    profession: "actor",
    nationality: "British",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/440px-Emma_Watson_2013.jpg",
    hint: "Hermione Granger in Harry Potter",
  },
  {
    id: 9,
    name: "Dwayne Johnson",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/440px-Dwayne_Johnson_2014_%28cropped%29.jpg",
    hint: "Also known as The Rock",
  },
  {
    id: 10,
    name: "Natalie Portman",
    profession: "actor",
    nationality: "Israeli-American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Natalie_Portman_%2848470950352%29_%28cropped%29.jpg/440px-Natalie_Portman_%2848470950352%29_%28cropped%29.jpg",
    hint: "Star Wars prequel trilogy and Black Swan",
  },
  {
    id: 11,
    name: "Brad Pitt",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg",
    hint: "Fight Club and Once Upon a Time in Hollywood",
  },
  {
    id: 12,
    name: "Jennifer Lawrence",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/440px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg",
    hint: "Katniss Everdeen in The Hunger Games",
  },
  {
    id: 13,
    name: "Will Smith",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg/440px-TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg",
    hint: "Fresh Prince and Men in Black star",
  },
  {
    id: 14,
    name: "Cate Blanchett",
    profession: "actor",
    nationality: "Australian",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Cate_Blanchett_2011.jpg/440px-Cate_Blanchett_2011.jpg",
    hint: "Galadriel in Lord of the Rings",
  },
  {
    id: 15,
    name: "Keanu Reeves",
    profession: "actor",
    nationality: "Canadian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Keanu_Reeves_2023.jpg/440px-Keanu_Reeves_2023.jpg",
    hint: "Neo in The Matrix",
  },
  {
    id: 16,
    name: "Shah Rukh Khan",
    profession: "actor",
    nationality: "Indian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shah_Rukh_Khan_grance_the_launch_of_the_new_Tag_Heuer_collection.jpg/440px-Shah_Rukh_Khan_grance_the_launch_of_the_new_Tag_Heuer_collection.jpg",
    hint: "King of Bollywood",
  },
  {
    id: 17,
    name: "Jackie Chan",
    profession: "actor",
    nationality: "Chinese",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Jackie_Chan_July_2016.jpg/440px-Jackie_Chan_July_2016.jpg",
    hint: "Martial arts comedy legend",
  },
  {
    id: 18,
    name: "Gal Gadot",
    profession: "actor",
    nationality: "Israeli",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Gal_Gadot_%2833652066113%29_%28cropped%29.jpg/440px-Gal_Gadot_%2833652066113%29_%28cropped%29.jpg",
    hint: "Wonder Woman in the DC universe",
  },
  // === MUSICIANS (25%) ===
  {
    id: 19,
    name: "Taylor Swift",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/440px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png",
    hint: "Eras Tour and Shake It Off",
  },
  {
    id: 20,
    name: "Drake",
    profession: "musician",
    nationality: "Canadian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Drake_July_2016.jpg/440px-Drake_July_2016.jpg",
    hint: "Started from the Bottom rapper from Toronto",
  },
  {
    id: 21,
    name: "Beyoncé",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/440px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png",
    hint: "Queen Bey, former Destiny's Child member",
  },
  {
    id: 22,
    name: "Ed Sheeran",
    profession: "musician",
    nationality: "British",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/440px-Ed_Sheeran-6886_%28cropped%29.jpg",
    hint: "Shape of You and Perfect singer",
  },
  {
    id: 23,
    name: "Adele",
    profession: "musician",
    nationality: "British",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg/440px-Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg",
    hint: "Rolling in the Deep and Hello singer",
  },
  {
    id: 24,
    name: "Eminem",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Eminem_performing_in_2018_%28cropped%29.jpg/440px-Eminem_performing_in_2018_%28cropped%29.jpg",
    hint: "Slim Shady, Lose Yourself rapper",
  },
  {
    id: 25,
    name: "Rihanna",
    profession: "musician",
    nationality: "Barbadian",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/440px-Rihanna_Fenty_2018.png",
    hint: "Umbrella singer and Fenty founder",
  },
  {
    id: 26,
    name: "Bruno Mars",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bruno_Mars%2C_Las_Vegas_%28cropped%29.jpg/440px-Bruno_Mars%2C_Las_Vegas_%28cropped%29.jpg",
    hint: "Uptown Funk and 24K Magic singer",
  },
  {
    id: 27,
    name: "Lady Gaga",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped%29_3.jpg/440px-Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped%29_3.jpg",
    hint: "Poker Face and Born This Way artist",
  },
  {
    id: 28,
    name: "Kanye West",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg/440px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg",
    hint: "Yeezy, Gold Digger, fashion mogul",
  },
  {
    id: 29,
    name: "Billie Eilish",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg/440px-Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg",
    hint: "Bad Guy singer, youngest Grammy Album winner",
  },
  {
    id: 30,
    name: "Elton John",
    profession: "musician",
    nationality: "British",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Elton_John_2023_HRC_%28cropped%29.jpg/440px-Elton_John_2023_HRC_%28cropped%29.jpg",
    hint: "Rocket Man and Your Song pianist",
  },
  {
    id: 31,
    name: "Shakira",
    profession: "musician",
    nationality: "Colombian",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shakira_2014.jpg/440px-Shakira_2014.jpg",
    hint: "Hips Don't Lie, Waka Waka singer",
  },
  {
    id: 32,
    name: "BTS (Jungkook)",
    profession: "musician",
    nationality: "South Korean",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jungkook_at_the_White_House.png/440px-Jungkook_at_the_White_House.png",
    hint: "K-pop global sensation, Dynamite group",
  },
  // === ATHLETES (25%) ===
  {
    id: 33,
    name: "Lionel Messi",
    profession: "athlete",
    nationality: "Argentine",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lionel_Messi_WC2022.jpg/440px-Lionel_Messi_WC2022.jpg",
    hint: "8-time Ballon d'Or winner, World Cup champion",
  },
  {
    id: 34,
    name: "Cristiano Ronaldo",
    profession: "athlete",
    nationality: "Portuguese",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg",
    hint: "CR7, most Instagram followers",
  },
  {
    id: 35,
    name: "Serena Williams",
    profession: "athlete",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Serena_Williams_competing_at_the_2015_French_Open.jpg/440px-Serena_Williams_competing_at_the_2015_French_Open.jpg",
    hint: "23 Grand Slam singles tennis champion",
  },
  {
    id: 36,
    name: "LeBron James",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/LeBron_James_%2851959977108%29_%28cropped2%29.jpg/440px-LeBron_James_%2851959977108%29_%28cropped2%29.jpg",
    hint: "King James, 4-time NBA champion",
  },
  {
    id: 37,
    name: "Usain Bolt",
    profession: "athlete",
    nationality: "Jamaican",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Usain_Bolt_Rio_100m_final_2016k.jpg/440px-Usain_Bolt_Rio_100m_final_2016k.jpg",
    hint: "Fastest man ever, Lightning Bolt pose",
  },
  {
    id: 38,
    name: "Neymar",
    profession: "athlete",
    nationality: "Brazilian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg/440px-20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg",
    hint: "Brazilian football star, PSG and Barcelona",
  },
  {
    id: 39,
    name: "Roger Federer",
    profession: "athlete",
    nationality: "Swiss",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/R_Federer.jpg/440px-R_Federer.jpg",
    hint: "20 Grand Slam tennis titles, Swiss maestro",
  },
  {
    id: 40,
    name: "Simone Biles",
    profession: "athlete",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Simone_Biles_in_2024_%28cropped%29.jpg/440px-Simone_Biles_in_2024_%28cropped%29.jpg",
    hint: "Most decorated gymnast in history",
  },
  {
    id: 41,
    name: "Michael Jordan",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg",
    hint: "Air Jordan, 6-time NBA champion with Bulls",
  },
  {
    id: 42,
    name: "Virat Kohli",
    profession: "athlete",
    nationality: "Indian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg/440px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    hint: "Indian cricket superstar",
  },
  {
    id: 43,
    name: "Kylian Mbappé",
    profession: "athlete",
    nationality: "French",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/440px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg",
    hint: "French football prodigy, Real Madrid star",
  },
  {
    id: 44,
    name: "Naomi Osaka",
    profession: "athlete",
    nationality: "Japanese",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Naomi_Osaka_%2850092702498%29_%28cropped%29.jpg/440px-Naomi_Osaka_%2850092702498%29_%28cropped%29.jpg",
    hint: "4-time Grand Slam tennis champion from Japan",
  },
  {
    id: 45,
    name: "Lewis Hamilton",
    profession: "athlete",
    nationality: "British",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/440px-Lewis_Hamilton_2016_Malaysia_2.jpg",
    hint: "7-time F1 World Champion",
  },
  {
    id: 46,
    name: "Tom Brady",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Tom_Brady_2017.jpg/440px-Tom_Brady_2017.jpg",
    hint: "7-time Super Bowl champion quarterback",
  },
  // === OTHER (20%) - Politicians, Business, etc. ===
  {
    id: 47,
    name: "Elon Musk",
    profession: "other",
    nationality: "South African-American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
    hint: "Tesla and SpaceX CEO",
  },
  {
    id: 48,
    name: "Oprah Winfrey",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg",
    hint: "Queen of daytime TV, media mogul",
  },
  {
    id: 49,
    name: "Barack Obama",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/440px-President_Barack_Obama.jpg",
    hint: "44th President of the United States",
  },
  {
    id: 50,
    name: "Malala Yousafzai",
    profession: "other",
    nationality: "Pakistani",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Malala_Yousafzai_at_Girl_Summit_2014-_Wikimedia_crop.jpg/440px-Malala_Yousafzai_at_Girl_Summit_2014-_Wikimedia_crop.jpg",
    hint: "Youngest Nobel Peace Prize laureate",
  },
  {
    id: 51,
    name: "Jeff Bezos",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg",
    hint: "Amazon founder and space entrepreneur",
  },
  {
    id: 52,
    name: "Kim Kardashian",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kim_Kardashian_West_in_August_2019_%28cropped%29.jpg/440px-Kim_Kardashian_West_in_August_2019_%28cropped%29.jpg",
    hint: "Reality TV star and business mogul",
  },
  {
    id: 53,
    name: "Mark Zuckerberg",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
    hint: "Facebook/Meta founder",
  },
  {
    id: 54,
    name: "Queen Elizabeth II",
    profession: "other",
    nationality: "British",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Queen_Elizabeth_II_in_March_2015.jpg/440px-Queen_Elizabeth_II_in_March_2015.jpg",
    hint: "Longest-reigning British monarch",
  },
  {
    id: 55,
    name: "Gordon Ramsay",
    profession: "other",
    nationality: "British",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gordon_Ramsay.jpg/440px-Gordon_Ramsay.jpg",
    hint: "Hell's Kitchen celebrity chef",
  },
  {
    id: 56,
    name: "David Attenborough",
    profession: "other",
    nationality: "British",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sir_David_Attenborough._Botanist_%28cropped%29.jpg/440px-Sir_David_Attenborough._Botanist_%28cropped%29.jpg",
    hint: "Legendary nature documentary narrator",
  },
  {
    id: 57,
    name: "Michelle Obama",
    profession: "other",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/440px-Michelle_Obama_2013_official_portrait.jpg",
    hint: "Former First Lady, Becoming author",
  },
  {
    id: 58,
    name: "Nelson Mandela",
    profession: "other",
    nationality: "South African",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg",
    hint: "Anti-apartheid icon, first Black president of South Africa",
  },
  // === MORE ACTORS ===
  {
    id: 59,
    name: "Zendaya",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/440px-Zendaya_-_2019_by_Glenn_Francis.jpg",
    hint: "Euphoria and Spider-Man star",
  },
  {
    id: 60,
    name: "Chris Hemsworth",
    profession: "actor",
    nationality: "Australian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/440px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg",
    hint: "Thor in the MCU",
  },
  {
    id: 61,
    name: "Denzel Washington",
    profession: "actor",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Denzel_Washington_2018.jpg/440px-Denzel_Washington_2018.jpg",
    hint: "Training Day and The Equalizer star",
  },
  {
    id: 62,
    name: "Margot Robbie",
    profession: "actor",
    nationality: "Australian",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg/440px-Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg",
    hint: "Barbie movie star and Harley Quinn",
  },
  // === MORE MUSICIANS ===
  {
    id: 63,
    name: "The Weeknd",
    profession: "musician",
    nationality: "Canadian",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/The_Weeknd_with_hand_on_face.jpg/440px-The_Weeknd_with_hand_on_face.jpg",
    hint: "Blinding Lights and Starboy singer",
  },
  {
    id: 64,
    name: "Ariana Grande",
    profession: "musician",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png/440px-Ariana_Grande_Grammys_Red_Carpet_2020.png",
    hint: "Thank U Next and 7 Rings singer",
  },
  {
    id: 65,
    name: "Post Malone",
    profession: "musician",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Post_Malone_Stavernfestivalen_2018_%28cropped%29.jpg/440px-Post_Malone_Stavernfestivalen_2018_%28cropped%29.jpg",
    hint: "Rockstar and Sunflower rapper with face tattoos",
  },
  // === MORE ATHLETES ===
  {
    id: 66,
    name: "Stephen Curry",
    profession: "athlete",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Stephen_Curry_dribbling_2016_%28cropped%29.jpg/440px-Stephen_Curry_dribbling_2016_%28cropped%29.jpg",
    hint: "Greatest 3-point shooter, Golden State Warriors",
  },
  {
    id: 67,
    name: "Conor McGregor",
    profession: "athlete",
    nationality: "Irish",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Conor_McGregor_2018_%28cropped%29.jpg/440px-Conor_McGregor_2018_%28cropped%29.jpg",
    hint: "Notorious UFC fighter from Dublin",
  },
  {
    id: 68,
    name: "Rafael Nadal",
    profession: "athlete",
    nationality: "Spanish",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Rafael_Nadal_%28Mutua_Madrid_Open_2019%29.jpg/440px-Rafael_Nadal_%28Mutua_Madrid_Open_2019%29.jpg",
    hint: "King of Clay, 22 Grand Slam titles",
  },
  // === MORE OTHER ===
  {
    id: 69,
    name: "Bill Gates",
    profession: "other",
    nationality: "American",
    gender: "male",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg",
    hint: "Microsoft co-founder and philanthropist",
  },
  {
    id: 70,
    name: "Emma Stone",
    profession: "actor",
    nationality: "American",
    gender: "female",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Emma_Stone_at_the_39th_Mill_Valley_Film_Festival_%28cropped%29.jpg/440px-Emma_Stone_at_the_39th_Mill_Valley_Film_Festival_%28cropped%29.jpg",
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
