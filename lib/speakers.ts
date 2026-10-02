export interface SpeakerDescription {
  title: string;
  descriptions: string[];
}

export interface Speaker {
  name: string;
  role: string;
  topic: string;
  session: string;
  imgUrl: string;
  speakerDescriptions?: SpeakerDescription[];
  extra?: string;
  day?: 1 | 2;
}

export const SPEAKERS: Speaker[] = [
  {
    name: "Most Rev. Rex Andrew Alarcon",
    role: "Chair, Episcopal Commission on Social Communications (ECSC)",
    session: "Keynote",
    topic:
      '"To Work and to Take Care (Gen. 2:15): Human Dignity at the Heart of AI Innovation in Media Ministry"',
    imgUrl: "/speakers/archbishop-rex.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "His Grace, the Most Reverend Rex Andrew Clement Alarcon, Doctor of Divinity, was born in Daet, Camarines Norte on 06 August 1970 to +Armando Alveus Alarcon, Sr. Juanita Culvera Clement.",
        ],
      },
      {
        title: "Educational Background",
        descriptions: [
          "He finished Kindergarten, Preparatory and Elementary at the Naga Parochial School and Secondary at the Holy Rosary Minor Seminary.",
          "He obtained a Bachelor of Arts (AB) Major in Philosophy at the Holy Rosary College Seminary, Naga City; a Bachelors in Sacred Theology (S.T.B.) from the University of Santo Tomas Manila; Master of Arts in Higher Religious Studies (M.A.) from the University of Santo Tomas in Manila; a Licentiate in Sacred Theology (S.T.L.) from the University of Santo Tomas, Manila and a Licenza &ndash;Storia della Chiesa (Church History) from the Pontificia Universita Gregoriana in Rome.",
        ],
      },
      {
        title: "Priestly Ministry",
        descriptions: [
          "On November 11, 1995, Sem. Rex Andrew C. Alarcon was ordained Deacon by +Jaime Cardinal L. Sin. The following year, November 9, 1996, he was ordained a priest for the Archdiocese of Caceres by +Archbishop Leonardo Z. Legaspi, OP.",
          "On January 2, 2019, Pope Francis appointed Fr. Alarcon as the 4th Bishop of Daet. He was ordained Bishop on March 19, 2019, on the Solemnity of St. Joseph, by Archbishop Rolando J. Tria Tirona, OCD as principal consecrator, with Apostolic Nuncio Tito Adolfo C. Yllana and Bishop Manolo A. De los Santos as co-consecrators.",
          "At the retirement of Archbishop Rolando J. Tria Tirona, OCD, Bishop Alarcon was appointed 5th Metropolitan Archbishop of Caceres on February 22, 2024, Feast of the Chair of St. Peter, the Apostle. Last March 19, 2024, he completed 5 years of episcopal ministry in the Diocese of Daet.",
          "He was elected as the Chairman of the Catholic Bishops' Conference of the Philippines (CBCP) &ndash; Episcopal Commission on Social Communications in July 2025, with his term officially beginning on December 1, 2025.",
        ],
      },
    ],
  },
  {
    name: "Mr. Howie Severino",
    role: "Journalist, Documentarist",
    session: "Plenary Session 1",
    topic: '"To Work: Human Creativity in AI-Assisted Communication"',
    imgUrl: "/speakers/howie-severino.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          'Horacio "Howie" Severino has been a journalist for nearly 40 years, and has produced over 200 TV documentaries.',
          "He is in his 24th year as a TV documentarist for I-Witness, one of the longest-running television shows in the Philippines. He is also a pioneering podcast host for GMA Integrated News.",
          "From 2009 to 2014, he was editor-in-chief of GMA News Online.",
          "Howie graduated from Tufts University with a degree in History, magna cum laude. He received his MA degree in Environmental Policy from Sussex University.",
        ],
      },
      {
        title: "Recognitions and Awards",
        descriptions: [
          "CMMA Best Newspaper Reporter (1991): Recognized for his outstanding work in print journalism prior to his prominent broadcast career.",
          "2000 National Book Award for Journalism: Shared as part of the Philippine Center for Investigative Journalism (PCIJ) for the book Betrayal of the Public Trust.",
          "Rotary Club of Manila Journalism Hall of Fame (2007)",
          "Titus Brandsma Award (2009): Received for Leadership in Journalism.",
          "Metrobank Foundation Journalist of the Year (2015)",
          "US International Film & Video Festival Gold Camera Award (2017): Won for the documentary Busal (Muzzled), which detailed the impact of the government's drug war on the urban poor.",
          "18th Gawad Tanglaw Awards (2020): Awarded Best Documentary for Ako si Patient 2828, a personal documentary chronicling his experience as an early COVID-19 survivor.",
          "Multiple-time winner (Hall of Fame) for Best Documentarist at the University of the Philippines Los Baños (UPLB) Gandingan Awards.",
          "In 2023, he was given the Balagtas literary award for his writings by the Unyon ng mga Manunulat ng Pilipinas.",
          "Metrobank Foundation Award for Continuing Excellence and Service (2024)",
          "The Howie Severino Podcast won the Best Educational Program at the 2023 Catholic Mass Media Awards (CMMA).",
        ],
      },
    ],
  },
  {
    name: "Ms. Gretchen Ho",
    role: "Broadcaster, journalist, athlete",
    session: "Plenary Session 2",
    topic: '"To Take Care: Truth in the Age of Deepfakes"',
    imgUrl: "/speakers/gretchen-ho.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "Gretchen Ho is one of the Philippines' most respected multimedia journalists and storytellers, known for her commitment to bringing meaningful stories closer to the public.",
          'Widely recognized as the “Woman in Action,” she has built a career anchored on truth, service, and a passion for empowering communities through journalism.',
          "Before becoming a prominent figure in news and public affairs, Gretchen first distinguished herself as a collegiate athlete. She played for the Ateneo Lady Eagles from 2008 to 2013, helping lead the team to historic back-to-back UAAP Finals appearances as part of the celebrated “Fab Five.” She later continued her athletic career in the professional ranks, winning the 2014 Philippine Super Liga Grand Prix Conference championship.",
          "Her transition from sports to journalism was marked by the same discipline, resilience, and excellence that defined her athletic career. Beginning as a host of the sports magazine program Gameday Weekend, Gretchen soon expanded her role to become a news anchor, field reporter, and current affairs presenter, covering stories that inform, inspire, and create impact.",
          "Today, she is recognized not only for her engaging presence on screen but also for her dedication to public service journalism. Through her reporting, she has championed stories of ordinary Filipinos, highlighted issues of national significance, and fostered meaningful conversations on matters that affect communities across the country.",
          "Her excellence in broadcasting and factual storytelling has earned numerous accolades, including the 2025 Asian Academy Creative Awards National Winner for Best Factual Presenter (Philippines) for her work on Morning Matters on One News.",
          "She has also been honored with the Gawad Pilipino Awards' Best New Female Segment Host and Icon of the Year - Outstanding Female TV Presenter, the Gawad Lasallianeta Most Outstanding Female Correspondent Award, and the Paragala Media Awards' Best News Personality recognition.",
          "Through every story she tells, Gretchen Ho continues to exemplify the vital role of journalism in shaping informed, compassionate, and engaged communities."
        ],
      },
    ],
  },
  {
    name: "Ms. Alex Rich",
    role: "Fundraising & Partnerships Leader",
    session: "Plenary Session 3",
    topic: "Sustainable Media for Mission and Ministry",
    imgUrl: "/speakers/alex-rich.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "Alex Rich is a laywoman from Albuquerque, New Mexico, in the Southwest United States.",
          "She has dedicated over 10 years of her professional career to guiding organizations, both secular and faith-based, in crafting and sharing their stories through communication and development.",
          "Alex is a fellow of the Vatican's Faith Communication in the Digital World program. She continues to serve with the Dicastery of Communication as an instructor and special projects manager. ",
          "She is currently the Senior Manager of Corporate Partnerships and Development for Make-A-Wish America, where she raises mission-critical funds to grant life-changing wishes for children with critical illnesses.",
        ],
      },
    ],
  },
  {
    session: "Breakout Session 1",
    name: "Rev. Fr. Albert Garong, SSP",
    role: 'Host of "The PadsCast"',
    topic: "The Power of Voice: Crafting Meaningful Audio Content",
    extra: '"The Storyteller\'s Toolkit: Writing & Interviewing"',
    imgUrl: "/speakers/fr-albert.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          'Fr. Albert Garong is a priest of the Society of St. Paul, ordained on November 17, 2018. Currently serving as the Assistant Director for ST PAULS Creative, "Pads Albert" sits at the intersection of faith, media, and modern culture.',
          'A seasoned content creator, he has been producing and hosting “PadsCast” since 2020, a video podcast featuring candid, soulful conversations between priests and lay Catholics. His creative reach extends further through his digital persona, @Fatherbrews, where he expertly blends his roles as a priest and a barista. By merging the art of specialty coffee with the Gospel, he leads a unique mission of "coffee-evangelization" through original online content—including his "One Shot Homilies" series—as well as coffee pop-ups, bar takeovers, and the community-centered Kape Ni Maria.',
          "Fr. Albert earned his degrees in Philosophy and Communications from the St. Paul Seminary Foundation (2008) and completed his theological studies at the Loyola School of Theology, Ateneo de Manila University (2015). Today, he continues to leverage videography and specialty coffee as tools to make the Word of God accessible in the digital age.",
        ],
      },
    ],
    day: 1,
  },
  {
    session: "Breakout Session 2",
    name: "Ms. Annie Perez",
    role: "UP Cebu Professor, ABS-CBN Regional Correspondent",
    topic: "The Storyteller's Toolkit: Writing & Interviewing",
    extra: "",
    imgUrl: "/speakers/annie-perez.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "Annie Fe Genon Perez-Gallardo is an Assistant Professor of Communication and Journalism at the University of the Philippines Cebu and a Multimedia Correspondent for ABS-CBN News.",
          "She earned her Master of Arts in Journalism from the University of the Philippines Diliman, where she received the Dean's Medal for Academic Excellence, and graduated Magna Cum Laude and Class Valedictorian from UP Cebu.",
          "With over a decade of experience in journalism, broadcasting, and media education, she has presented research at international conferences and received multiple recognitions from the Globe Media Excellence Awards for her journalism and multimedia storytelling.",
        ],
      },
      {
        title: "Professional Credentials",
        descriptions: [
          "Assistant Professor of Communication and Journalism at University of the Philippines Cebu, teaching journalism, multimedia production, broadcasting, and communication courses.",
          "Multimedia Correspondent for ABS-CBN News and former News Operations Specialist, Producer, Director, and Executive Producer at ABS-CBN Cebu, with more than a decade of experience in journalism, broadcast production, and news reporting.",
          "Holds a Master of Arts in Journalism from University of the Philippines Diliman, where she received the Dean's Medal for Academic Excellence, and graduated Magna Cum Laude and Class Valedictorian with a Bachelor of Arts in Mass Communication from University of the Philippines Cebu.",
          "Published researcher and presenter at national and international conferences, including the International Association for Media and Communication Research, the Asian Congress for Media and Communication, and the Journalism Studies Association of the Philippines.",
          "Author of peer-reviewed studies on journalism, media authenticity, and news production published in regional and national scholarly journals.",
          "Recipient of multiple journalism honors, including First Place, Best Social Media Video and Second Place, Best TV News Report at the 2025 Globe Media Excellence Awards.",
        ],
      },
    ],
    day: 1,
  },
  {
    session: "Breakout Session 3",
    name: "Mr. Aubry Lerio",
    role: "Founder, aFilm PH",
    topic: "Stories That Move: The Art of Video Storytelling",
    extra: "",
    imgUrl: "/speakers/aubry-lerio.jpg",
    speakerDescriptions: [
      {
        title: "Recognitions and Awards",
        descriptions: [
          'Director, "Rosaryo" - Best Short Film, Cebu Archdiocesan Mass Media Awards',
          'Director of Photography, "Bad Elements" &ndash; Best Picture and Best Cinematography, Oroquita Film Festival',
          "Director of Photography of “Bad Elements” &ndash; Top 5 Finalist, FNF Philippines",
          "Director, “Eyeglasses” - Finalist, Sinulog Short Film Festival",
          "Director, “Before Crossing” - Finalist, Sinulog Short Film Festival",
          "Director, “9 Days” - Finalist, Sinulog Short Film Festival",
          "Director, Michael's Eyes &ndash; International Film Trailer",
        ],
      },
    ],
    day: 1,
  },
  {
    session: "Breakout Session 4",
    name: "Mr. Miko Mel C. Peñaloza",
    role: "Actor / Assistant Director | Church Worker, Diocese of San Pablo",
    topic: "BTS: The Production Process",
    extra: "",
    imgUrl: "/speakers/miko-penaloza.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "Miko Peñaloza is a filmmaker, actor, assistant director, and church worker serving in the Diocese of San Pablo. With experience in both media production and pastoral ministry, he combines creativity, leadership, and a passion for storytelling in his work. He has served as one of the Assistant Directors of ABS-CBN's Goin' Bulilit, contributing to the development and production of television content for young audiences. Dedicated to both the arts and faith-based service, he continues to use his talents to inspire, educate, and build meaningful connections within the community.",
        ],
      },
      {
        title: "Work Experience",
        descriptions: [
          "TV / Film Actor (2016 to Present): Dolce Amore, ABS-CBN (2016); Hashtag Michael Angelo the Sitcom, GMANEWSTV (2016-2020); Bagani, ABS-CBN (2018); Fantastica, StarCinema (2018); The Spider's Man, See Thru (2019);½ (TV MOVIE), GMA (2019); Parasite Island, ABS-CBN (2019); Princess DayaResse, StarCinema (2020); Hugas, Vivamax (2021); Dear God, RIA Production (2022); Happy ToGetHer, GMA (2023); Pagpag 24/7, MAVx (2024); ConMom, MAVx (2025); Magpakailanman, GMA (2026);",
          "TV / Film Assistant Director: The Lease, See Thru (2018); Dear God, RIA Production (2021-2022); Goin' Bulilit, ABS-CBN (2024);",
          "Concert Director: Ginto Concert, Benefit Birthday Concert of Rev. Fr. Conrado J. Rodriguez, With Hadjji Alejandro and Rey Valera (2024); Diocesan Concerts, Diocese of San Pablo (2024-Present); To Be With You Album Launching, St. Luke the Evangelist (2025); Tan-Awa (Concert-TV SHOW), Bente Productions (2025-Present)",
        ],
      },
    ],
    day: 2,
  },
  {
    session: "Breakout Session 5",
    name: "Ms. April Frances Ortigas",
    role: "Web / UX Designer, Figma Specialist, Layout Artist, Digital Media Manager",
    topic: "Visualizing Ideas: The Art of Graphics and Layouting",
    extra: "",
    imgUrl: "/speakers/april-ortigas.jpg",
    speakerDescriptions: [
      {
        title: "Background",
        descriptions: [
          "Fondly called “Sky”, she is a Filipino UX/UI designer, Catholic communicator, and creative entrepreneur with over a decade of experience at the intersection of faith and digital media.",
          "A computer engineering graduate, she serves as online media manager, UX/UI designer, and layout artist for the Media Office of the Catholic Bishops' Conference of the Philippines and Areopagus Communications, Inc., where she handles all things design, from digital platforms to print publications.",
          "Alongside her work with the CBCP, she runs an active freelance and consulting practice, designing websites, brand identities, and digital experiences for clients across industries.",
          "Sky has dedicated much of her career to the Catholic digital mission. She serves as Vice President of YouthPinoy, a Catholic community that forms and mobilizes young online missionaries to evangelize through digital media.",
          "Her work in the Catholic space extends beyond design, encompassing content strategy, digital communications, and helping the Church speak clearly and compellingly in online spaces. She previously served as a missionary for Couples for Christ in Kenya and Tanzania, and held a role in the CFC Global Communications Office, giving her both a grassroots and institutional understanding of Catholic mission work.",
          "Her work consistently sits at the crossroads of design, craft, storytelling, and mission.",
        ],
      },
    ],
  },
  {
    session: "Breakout Session 6",
    name: "Ms. Kia Abrera",
    role: "Founder of Brave Creators Lab, Co-founder of Braveworks Inc.",
    topic: "Think Before You Create: Cognitive Strategies for Engaging Content",
    extra: "",
    imgUrl: "/speakers/kia-abrera.jpg",
    speakerDescriptions: [
      {
        title: "Education",
        descriptions: [
          "Certificate in Entrepreneurship (3 months), Singapore Polytechnic, 2019",
          "Innovative and Creative Enterprise (3 months), Thames International, 2019",
          "Bachelor of Arts in Film and Audio Visual Communication, University of the Philippines - Diliman, 2010",
          "High School, Colegio de las Hijas de Jesus, 2006",
        ],
      },
      {
        title: "Background",
        descriptions: [
          "Kia Abrera is a cognitive strategist working at the intersection of human behavior, neuroplasticity, communication, and strategy. She helps individuals, teams, and organizations think more clearly, decide more accurately, and communicate more effectively in high-pressure, high-noise environments.",
          "She is the co-founder and CEO of Braveworks Inc., a marketing and strategy consultancy she built with her husband. Over the past 11 years, her work has contributed to more than $500M in client results, supporting clients from micro-entrepreneurs to global organizations. Her experience spans brand strategy, behavioral marketing, leadership communication, and decision-making clarity—always grounded in how people actually think and behave, not how we assume they should.",
          "In 2023, Kia launched The Brave Creators Lab, an education ecosystem designed to help creative professionals learn the business of creativity, and to develop clarity, self-trust, and strategic thinking by understanding the mind behind their work. The Lab integrates principles from neuroplasticity, behavioral science, and communication psychology, with a strong emphasis on self-mastery as a prerequisite for sustainable growth.",
          "Kia is also a leading educreator on TikTok, where her work on thinking patterns, creativity, and human behavior has reached over 200,000 followers.",
          "She was shortlisted in the Top 17 for Best Education Creator at the TikTok Awards and was included in the Best of TikTok 2023 list.",
          "In October 2024, Kia earned a global certification in applied neuroscience, receiving her Professional Neuroplastician credential. This formal training deepened her long-standing practice of integrating neuromarketing, consumer neuroscience, and behavior change into strategy, communication, and personal development work. Today, she applies neuroplasticity principles not only in marketing, but also in leadership clarity, team dynamics, and individual growth.",
          "Her work and insights have been featured across major media platforms, including ANC Business Roadshow, CNN Philippines, Rappler, Adobo Magazine, GMA Lifestyle, and When In Manila.",
          "Kia has worked with a wide range of organizations, including USAID, The Futur, Coca-Cola, Shell, and Toyota, among others. She is also a professor at Meridian International College, where she teaches Psychology of Marketing and Market Research & Consumer Behavior.",
          "At the core of Kia's work is a simple conviction: clarity precedes performance. She continues her mission of helping people protect their thinking, rebuild trust in their minds, and use understanding—not pressure—as the foundation for meaningful growth.",
        ],
      },
    ],
  },
];
