const EPISODES = [
  {
    id: 27,
    guest: "Jamie Bartlett",
    title: "The Dark Net, Crypto & the Future of Freedom",
    thumb: "assets/E2 7Jamie Bartlett.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Journalist and author Jamie Bartlett on how the dark web pioneered crypto adoption, what it revealed about the limits of state control, and what the future of privacy and digital freedom actually looks like.",
    bio: "Jamie Bartlett is a British journalist and author best known for The Dark Net and The People Vs Tech. He writes and speaks on technology, politics, and society."
  },
  {
    id: 25,
    guest: "Alex Davis",
    title: "Inside Crypto Media: Building the Story of a Generation",
    thumb: "assets/E25 Alex Davis.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Alex Davis on what it takes to cover the most volatile, consequential beat in finance, how crypto media has matured, and the stories that still haven't been told.",
    bio: "Alex Davis is a leading crypto journalist who has covered blockchain, digital assets, and the regulatory landscape for major media outlets."
  },
  {
    id: 26,
    guest: "Jason Gottlieb",
    title: "Inside the Crypto Courtroom",
    thumb: "assets/E26 Jason Gottlieb.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "The defense attorney who has been in the trenches of the most high-profile crypto cases. Jason Gottlieb breaks down the legal battles defining the industry and what the courtroom really looks like when crypto is on trial.",
    bio: "Jason Gottlieb is a Partner at Morrison Cohen LLP, where he leads the firm's Cryptocurrency & Blockchain practice. He has represented clients in some of the most significant crypto enforcement actions in history."
  },
  {
    id: 28,
    guest: "Erin West",
    title: "Prosecuting Crypto Crime: A DA's Frontline Story",
    thumb: "assets/E28 Erin West.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Deputy DA Erin West on how law enforcement is catching up to crypto crime, the tools prosecutors are using, and what the judicial system still doesn't understand about blockchain.",
    bio: "Erin West is a Deputy District Attorney in Santa Clara County, California, known for her pioneering work prosecuting cryptocurrency-related crimes including pig butchering scams."
  },
  {
    id: 29,
    guest: "Is This Song a Security?",
    title: "NFTs, Music, and the Securities Question",
    thumb: "assets/E29 - Is this song a security.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "A deep dive into whether music NFTs could be classified as securities, what that means for artists and platforms, and how the Howey Test applies to digital creative assets.",
    bio: "A special episode exploring the intersection of music, NFTs, and securities law with leading experts in the field."
  },
  {
    id: 30,
    guest: "Flavia Naves",
    title: "Crypto Regulation in Latin America",
    thumb: "assets/E30 Flavia Naves.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Flavia Naves on how Latin America is becoming a global testing ground for crypto adoption, the regulatory frameworks emerging across the region, and what the rest of the world can learn.",
    bio: "Flavia Naves is a leading crypto and blockchain lawyer in Brazil, advising exchanges, protocols, and fintech companies on regulatory compliance across Latin America."
  },
  {
    id: 31,
    guest: "Moish Peltz",
    title: "Web3 Legal Strategy: Building for the Long Game",
    thumb: "assets/E31 Moish Peltz.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Moish Peltz on advising crypto companies through bull and bear markets, the legal structures that actually protect founders, and why most Web3 projects are getting compliance wrong.",
    bio: "Moish Peltz is a Web3 attorney and Partner at Falcon Rappaport & Berkman, where he advises blockchain companies, DAOs, and digital asset projects on legal strategy."
  },
  {
    id: 32,
    guest: "Joseph Page",
    title: "The Regulatory Reality of DeFi",
    thumb: "assets/E32 Joseph Page.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Joseph Page on the existential regulatory questions facing decentralized finance, who is liable when there is no central party, and whether DeFi can survive full regulatory scrutiny.",
    bio: "Joseph Page is a financial regulatory attorney specializing in DeFi and decentralized protocols, helping projects navigate the evolving legal landscape."
  },
  {
    id: 33,
    guest: "Jason Schwartz",
    title: "Crypto Tax: The Rules That Actually Apply",
    thumb: "assets/E33 Jason Schwartz.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Tax partner Jason Schwartz cuts through the confusion on crypto taxation — from staking rewards to airdrops to DeFi transactions — and explains what the IRS is actually focusing on.",
    bio: "Jason Schwartz is a Tax Partner at Fried Frank Harris Shriver & Jacobson LLP, where he specializes in cryptocurrency and digital asset taxation."
  },
  {
    id: 34,
    guest: "Amanda Tuminelli",
    title: "Fighting for DeFi in Washington",
    thumb: "assets/E34 Amanda Tuminelli.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Amanda Tuminelli on the DeFi Education Fund's mission, the lobbying battles in Congress, and why the fate of open financial protocols depends on getting crypto policy right.",
    bio: "Amanda Tuminelli is Executive Director of the DeFi Education Fund, a policy and advocacy organization dedicated to educating policymakers about decentralized finance."
  },
  {
    id: 35,
    guest: "Jake Brukhman",
    title: "Token Economics and the Art of Protocol Design",
    thumb: "assets/E35 Jake Brukhman.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Jake Brukhman on how to design token systems that actually work, the common mistakes founders make, and why tokenomics is as much a legal question as an economic one.",
    bio: "Jake Brukhman is Founder and CEO of CoinFund, one of crypto's leading investment firms, with deep expertise in token economics and protocol design."
  },
  {
    id: 36,
    guest: "JP Thor",
    title: "From Fighter Pilot to ThorChain Founder",
    thumb: "assets/E36 JP Thor.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "The anonymous force behind one of DeFi's most resilient protocols. JP Thor went from military jets to decentralised finance and built THORChain under a pseudonym that became legend in the crypto world.",
    bio: "JP Thor is the pseudonymous founder of THORChain, a decentralized cross-chain liquidity protocol. Before crypto, he was a fighter pilot — a background that shaped his approach to building under pressure."
  },
  {
    id: 37,
    guest: "Mati Greenspan",
    title: "Reading the Market: A Trader's View on Crypto Cycles",
    thumb: "assets/E37 Mati Greenspan.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Mati Greenspan on macro cycles, how to separate signal from noise, and what decades of market analysis have taught him about the psychology and structure of crypto markets.",
    bio: "Mati Greenspan is Founder of Quantum Economics, a boutique crypto research firm. He is a widely followed market analyst and commentator on digital assets."
  },
  {
    id: 38,
    guest: "Nick Furneaux",
    title: "Blockchain Forensics: Following the Money",
    thumb: "assets/E38_ Nick Furneaux.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Blockchain forensics expert Nick Furneaux on how investigators trace crypto through mixers, bridges, and privacy coins — and why the myth of anonymous crypto is largely just that: a myth.",
    bio: "Nick Furneaux is a leading blockchain forensics investigator and author of Investigating Cryptocurrencies. He trains law enforcement agencies worldwide in crypto tracing techniques."
  },
  {
    id: 39,
    guest: "Ofir Eliasi",
    title: "Building Crypto Infrastructure in Israel",
    thumb: "assets/E39_ Ofir Eliasi.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Ofir Eliasi on Israel's position as a global crypto hub, the regulatory environment for startups, and what it takes to build serious blockchain infrastructure from Tel Aviv.",
    bio: "Ofir Eliasi is a crypto entrepreneur and investor based in Israel, with experience building and scaling blockchain technology companies."
  },
  {
    id: 40,
    guest: "Prof. Edward Lee",
    title: "Copyright, NFTs, and the Future of Digital Ownership",
    thumb: "assets/E40_ prof. edward lee.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Law professor Edward Lee on what NFTs actually convey legally, how copyright law applies to digital assets, and whether the current legal framework is equipped for the age of tokenized ownership.",
    bio: "Professor Edward Lee is a law professor specializing in intellectual property, internet law, and blockchain. He has written extensively on NFTs and digital ownership rights."
  },
  {
    id: 41,
    guest: "Ouriel Ohayon",
    title: "Building ZenGo: Self-Custody Without the Risk",
    thumb: "assets/E41_ ouriel ohayon.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Ouriel Ohayon on building a keyless crypto wallet, the real security risks in self-custody, and why the industry needs to make holding your own assets as safe as a bank.",
    bio: "Ouriel Ohayon is CEO and co-founder of ZenGo, a keyless crypto wallet backed by top-tier investors. Previously he co-founded Appsfire and TechCrunch France."
  },
  {
    id: 42,
    guest: "Noah Perlman",
    title: "Compliance at Scale: Lessons from Binance",
    thumb: "assets/E42_ Noah Perlman.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Noah Perlman on what building a compliance function at one of the world's largest exchanges actually looks like, the challenges of operating globally, and how crypto compliance is maturing.",
    bio: "Noah Perlman served as Chief Compliance Officer at Binance, overseeing the exchange's global compliance program. He previously held senior roles at Morgan Stanley and the FBI."
  },
  {
    id: 43,
    guest: "Hester Peirce",
    title: "Crypto Mom on the SEC, Safe Harbors, and the Future of Regulation",
    thumb: "assets/E43_ Hester Peirce.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "SEC Commissioner Hester Peirce — known in the industry as Crypto Mom — on her famous safe harbor proposal, what the SEC has gotten wrong, and what a sensible regulatory framework for digital assets would actually look like.",
    bio: "Hester Peirce is a Commissioner of the U.S. Securities and Exchange Commission. Known as 'Crypto Mom' for her pro-innovation dissents, she has been one of the few voices for sensible crypto regulation within the SEC."
  },
  {
    id: 44,
    guest: "Eylon Aviv",
    title: "Investing in Web3: The Israeli Perspective",
    thumb: "assets/E44_ Eylon Aviv.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Eylon Aviv on Collider Ventures, what makes an investable crypto project, and how the Israeli tech ecosystem has become a breeding ground for some of the most important infrastructure in Web3.",
    bio: "Eylon Aviv is a partner at Collider Ventures, one of Israel's leading blockchain-focused venture capital funds."
  },
  {
    id: 47,
    guest: "Nadav Ellinson",
    title: "Layer 2s, Scaling, and the Race to Build Ethereum",
    thumb: "assets/E47_ Nadav Ellinson.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Nadav Ellinson on the scaling wars, what separates winning L2s from the rest, and why the architecture decisions being made today will define Ethereum's future for a decade.",
    bio: "Nadav Ellinson is a leading figure in Ethereum scaling, with deep expertise in Layer 2 infrastructure and the technical roadmap of the Ethereum ecosystem."
  },
  {
    id: 48,
    guest: "Dr. Jimmie Lenz",
    title: "Crypto in the Academy: Teaching the Next Generation",
    thumb: "assets/E48_ Dr. Jimmie Lenz.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Dr. Jimmie Lenz on building the first graduate programs in crypto and blockchain, what students need to know, and why universities are becoming the unexpected vanguard of digital asset education.",
    bio: "Dr. Jimmie Lenz is Director of the FinTech Program at Duke University's Pratt School of Engineering, where he developed one of the first blockchain-focused graduate curricula in the U.S."
  },
  {
    id: 49,
    guest: "Bentzi Rabi",
    title: "Stablecoins and the Architecture of Digital Money",
    thumb: "assets/E49_ bentzi rabi.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Bentzi Rabi on how stablecoins actually work under the hood, the risks that most users don't understand, and what a properly regulated stablecoin ecosystem should look like.",
    bio: "Bentzi Rabi is a blockchain architect and fintech expert specializing in stablecoin design, digital payment infrastructure, and financial systems innovation."
  },
  {
    id: 50,
    guest: "Amanda Wick",
    title: "Financial Crime and Crypto: The Investigator's View",
    thumb: "assets/E50_ Amanda Wick.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Amanda Wick on her years investigating financial crime, what crypto has changed for law enforcement, and the policy gaps that are letting bad actors operate with impunity.",
    bio: "Amanda Wick is a financial crime investigator and policy expert. She previously served as Chief of National Security at Chainalysis and held senior roles at the U.S. Department of Justice."
  },
  {
    id: 51,
    guest: "Eran Lahav",
    title: "Building Legal Tech for the Crypto Industry",
    thumb: "assets/E51_ Eran Lahav.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Eran Lahav on the intersection of legal technology and crypto, how smart contracts are changing the practice of law, and what legal infrastructure the industry desperately needs.",
    bio: "Eran Lahav is a legal technology innovator working at the intersection of blockchain and legal practice, advising companies on smart contract governance and legal automation."
  },
  {
    id: 52,
    guest: "Tigran Gambaryan",
    title: "The Man Who Broke Bitcoin Criminals",
    thumb: "assets/E52_ Tigran Gambaryan.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "The IRS agent who took down the biggest names in crypto crime. Tigran Gambaryan tracked billions across the blockchain and lived to tell the story — including what it was like inside a Nigerian detention cell.",
    bio: "Tigran Gambaryan is a former IRS Criminal Investigation special agent who led landmark cryptocurrency crime cases including Silk Road, BTC-e, and AlphaBay. He later served as Head of Financial Crime Compliance at Binance."
  },
  {
    id: 53,
    guest: "Carlo D'Angelo",
    title: "The Judge Who Understands Crypto",
    thumb: "assets/E53_ Carlo D'Angelo.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Judge Carlo D'Angelo on presiding over crypto cases, what courts still don't understand about blockchain technology, and why judicial education in digital assets is urgently needed.",
    bio: "Carlo D'Angelo is a judge with extensive experience in technology-related cases. He is known for his efforts to educate the judiciary on cryptocurrency and blockchain issues."
  },
  {
    id: 69,
    guest: "Dr. Shmuel Abramzon",
    title: "The Science of Blockchain: From Research to Reality",
    thumb: "assets/E69_ Dr. Shmuel Abramzon.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Dr. Shmuel Abramzon on what academic blockchain research reveals that the industry ignores, the scientific limits of current protocols, and where the breakthroughs in cryptography will come from.",
    bio: "Dr. Shmuel Abramzon is a blockchain researcher and academic with expertise in cryptographic protocols, consensus mechanisms, and the theoretical foundations of distributed systems."
  },
  {
    id: 70,
    guest: "Vivek Jayaram",
    title: "IP in Web3: Who Owns What on the Blockchain",
    thumb: "assets/E70_ Vivek Jayaram.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "IP attorney Vivek Jayaram on the intellectual property questions Web3 has created, why NFT ownership and copyright ownership are completely different things, and how brands are navigating digital identity.",
    bio: "Vivek Jayaram is an intellectual property attorney and partner at Jayaram Law, specializing in IP issues for crypto, NFT, and Web3 companies."
  },
  {
    id: 71,
    guest: "Charlie Shrem",
    title: "Bitcoin OG: A Raw Journey Through Bitcoin's Birth",
    thumb: "assets/E71_ Charlie Shrem.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "One of Bitcoin's earliest adopters and advocates. Charlie Shrem tells the unfiltered story of building BitInstant, going to prison, and coming out the other side still a believer — more than ever.",
    bio: "Charlie Shrem is one of the earliest Bitcoin pioneers. He co-founded BitInstant, one of the first Bitcoin exchanges, and served on the board of the Bitcoin Foundation. After serving a prison sentence, he returned to the industry as a vocal advocate and builder."
  },
  {
    id: 72,
    guest: "Joni Pirovich",
    title: "Crypto Law Down Under: Australia's Regulatory Path",
    thumb: "assets/E72_ Joni Pirovich.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Joni Pirovich on how Australia is approaching crypto regulation, the unique legal questions that have emerged in the Asia-Pacific region, and what global crypto lawyers can learn from each other.",
    bio: "Joni Pirovich is a leading Australian blockchain and cryptocurrency lawyer, advising on digital asset regulation, token offerings, and exchange compliance across the Asia-Pacific region."
  },
  {
    id: 73,
    guest: "Justin Wales",
    title: "The Legal Architecture of Crypto Exchanges",
    thumb: "assets/E73_ Justin Wales (Act II).jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Justin Wales on the complex licensing regimes facing crypto exchanges, the regulatory arbitrage game, and what a compliant global exchange actually looks like in 2024.",
    bio: "Justin Wales is a cryptocurrency regulatory attorney and former head of legal at major crypto exchanges, specializing in licensing, compliance, and exchange regulation."
  },
  {
    id: 74,
    guest: "Aaron Payas",
    title: "Crypto Regulation in Gibraltar and the Channel Islands",
    thumb: "assets/E74_ Aaron Payas.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Aaron Payas on why small jurisdictions like Gibraltar have become testing grounds for crypto regulation, what they got right, and what larger economies should borrow from their frameworks.",
    bio: "Aaron Payas is Gibraltar's Attorney General, having played a pivotal role in developing the jurisdiction's pioneering Distributed Ledger Technology regulatory framework."
  },
  {
    id: 75,
    guest: "Gabriel Shapiro",
    title: "DAOs, Legal Wrappers, and the Future of Organizational Law",
    thumb: "assets/E75_ Gabriel Shapiro.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Gabriel Shapiro on the legal status of DAOs, how legal wrappers work in practice, and why the organizational law questions raised by decentralized governance are genuinely unprecedented.",
    bio: "Gabriel Shapiro is a blockchain attorney specializing in DAOs, decentralized governance, and the legal personhood of decentralized organizations. He is one of the foremost thinkers on DAO legal structure."
  },
  {
    id: 76,
    guest: "Samuel Cardillo",
    title: "Tokenization: Turning the Real World On-Chain",
    thumb: "assets/E76_ Samuel Cardillo.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Samuel Cardillo on the legal and technical challenges of tokenizing real-world assets, which asset classes are most promising, and the infrastructure still needed to make RWA tokenization mainstream.",
    bio: "Samuel Cardillo is a blockchain architect and legal technologist specializing in real-world asset tokenization and the infrastructure required to bring traditional finance on-chain."
  },
  {
    id: 77,
    guest: "Ido Bar-On",
    title: "Israeli Crypto Regulation: What Comes Next",
    thumb: "assets/E77_ Ido Bar-On.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Ido Bar-On on the evolving Israeli regulatory landscape for crypto, how the Israel Securities Authority is approaching digital assets, and what the industry should expect in the coming years.",
    bio: "Ido Bar-On is a senior Israeli official with expertise in financial regulation and digital asset policy, playing a key role in shaping Israel's approach to crypto regulation."
  },
  {
    id: 78,
    guest: "Jake Chervinsky",
    title: "The Politics of Crypto: Washington's War on Digital Assets",
    thumb: "assets/E78_ Jake Chervinsky.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Jake Chervinsky on the political dynamics driving U.S. crypto policy, Operation Choke Point 2.0, and what the industry must do to win the battle for sensible regulation in Washington.",
    bio: "Jake Chervinsky is Chief Legal Officer at Variant Fund and one of the crypto industry's most prominent policy advocates. He previously served as General Counsel at Compound Finance and has been at the forefront of crypto policy debates."
  },
  {
    id: 79,
    guest: "Jake Adelstein",
    title: "Crypto, Crime, and the Yakuza",
    thumb: "assets/E79_ Jake Adelstein.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Investigative journalist Jake Adelstein on organized crime's embrace of cryptocurrency, how the Yakuza have used crypto exchanges, and what it took to expose some of the darkest corners of the industry.",
    bio: "Jake Adelstein is an American journalist and author who spent decades as a crime reporter in Japan. He is the author of Tokyo Vice and a leading expert on Japanese organized crime and its use of crypto."
  },
  {
    id: 80,
    guest: "Steve Epstein",
    title: "The VC View: What Crypto Investors Are Really Thinking",
    thumb: "assets/E80_ Steve Epstein.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Steve Epstein on how institutional investors evaluate crypto projects, what due diligence actually looks like, and the regulatory questions that keep sophisticated investors up at night.",
    bio: "Steve Epstein is a venture capitalist and crypto investor with experience backing blockchain companies across infrastructure, DeFi, and digital asset infrastructure."
  },
  {
    id: 81,
    guest: "Yehuda Lindell",
    title: "The Cryptography Behind Crypto: MPC, ZK, and Secure Computation",
    thumb: "assets/E81_ Yehuda Lindell.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Professor Yehuda Lindell on the advanced cryptography powering the next generation of blockchain technology — MPC, zero-knowledge proofs, and why the math is the most important part of the story.",
    bio: "Professor Yehuda Lindell is a world-leading cryptographer and co-founder of Unbound Security. He is a professor at Bar-Ilan University and one of the foremost experts on multi-party computation."
  },
  {
    id: 82,
    guest: "Paul R. Brody",
    title: "EY's Blockchain Vision: Enterprise Crypto at Scale",
    thumb: "assets/E82_ Paul R. Brody.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "EY's Global Blockchain Leader Paul Brody on why one of the Big Four accounting firms is all-in on Ethereum, what enterprise blockchain adoption actually looks like, and the business case for public chains.",
    bio: "Paul R. Brody is EY's Global Blockchain Leader, responsible for the firm's blockchain strategy and product development globally. He is a leading voice on enterprise blockchain adoption."
  },
  {
    id: 83,
    guest: "Danielle Tichner",
    title: "Building Compliant Crypto Businesses: A Practitioner's Guide",
    thumb: "assets/E83_ Danielle Tichner.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Danielle Tichner on the practical realities of building compliance programs for crypto companies, the biggest mistakes startups make, and how to grow fast without painting a target on your back.",
    bio: "Danielle Tichner is a crypto compliance expert and attorney specializing in helping digital asset companies build robust regulatory and AML frameworks."
  },
  {
    id: 84,
    guest: "Alex Scheer",
    title: "NFTs Beyond the Hype: What Actually Has Legal Validity",
    thumb: "assets/E84_ Alex Scheer.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Alex Scheer on separating NFT reality from NFT hype, which use cases have genuine legal substance, and how the technology will outlast the speculation cycle.",
    bio: "Alex Scheer is a digital assets attorney specializing in NFTs, gaming, and digital ownership, advising creators, platforms, and collectors on the legal framework of non-fungible tokens."
  },
  {
    id: 85,
    guest: "Anna George",
    title: "Crypto Derivatives: The Legal and Regulatory Frontier",
    thumb: "assets/E85_ Anna George.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Anna George on the rapidly evolving world of crypto derivatives, how regulators are approaching futures and options on digital assets, and the risk management questions that keep compliance officers awake.",
    bio: "Anna George is a derivatives and capital markets attorney with expertise in crypto-asset derivatives, regulated exchanges, and the CFTC's evolving framework for digital asset products."
  },
  {
    id: 86,
    guest: "Ran Neuner",
    title: "Crypto Man Ran on Building Crypto Banter",
    thumb: "assets/E86_ Ran Neuner.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "From South African media mogul to crypto's loudest voice. Ran Neuner built Crypto Banter into a global empire and he pulls no punches on what it really takes to survive — and thrive — in the wildest market on earth.",
    bio: "Ran Neuner is founder of Crypto Banter, one of the world's largest crypto media platforms. He is a former Shark Tank SA judge, entrepreneur, and one of the most recognized voices in crypto media."
  },
  {
    id: 87,
    guest: "Philipp Tsagolov",
    title: "Crypto Regulation in Europe: MiCA and Beyond",
    thumb: "assets/E87_ Philipp Tsagolov.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Philipp Tsagolov on Europe's landmark MiCA regulation, what it means for exchanges and issuers, and whether the EU's comprehensive approach to crypto is a model the rest of the world should follow.",
    bio: "Philipp Tsagolov is a leading European crypto regulatory attorney advising exchanges, issuers, and DeFi protocols on compliance with MiCA and EU financial regulations."
  },
  {
    id: 88,
    guest: "Daniel Lo",
    title: "Institutional Crypto: The Bridge Between TradFi and DeFi",
    thumb: "assets/E88_ Daniel Lo.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Daniel Lo on what institutional investors actually need before they can participate in crypto markets, how custody and prime brokerage are evolving, and where TradFi and DeFi will eventually converge.",
    bio: "Daniel Lo is a crypto markets and institutional finance expert, advising financial institutions on digital asset strategies, custody solutions, and the regulatory requirements for institutional crypto participation."
  },
  {
    id: 89,
    guest: "Yoni Assia",
    title: "eToro Founder: Building for 100 Million Users",
    thumb: "assets/E89_ Yoni Assia.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "The visionary who built one of the world's largest social investing platforms. Yoni Assia on creating eToro, navigating global regulation, and why he believes crypto will reshape the global financial system.",
    bio: "Yoni Assia is CEO and co-founder of eToro, the social investment platform with over 35 million users worldwide. He is an entrepreneur, investor, and vocal advocate for the democratization of finance through blockchain technology."
  },
  {
    id: 90,
    guest: "Stephen Sargeant",
    title: "Caribbean Crypto: Offshore Innovation and Regulatory Reality",
    thumb: "assets/E90_ Stephen Sargeant.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Stephen Sargeant on the Caribbean's emergence as a crypto hub, the regulatory frameworks developing in jurisdictions like the Bahamas and Cayman Islands, and the future of offshore crypto business.",
    bio: "Stephen Sargeant is a Caribbean-based crypto regulatory attorney advising digital asset businesses on offshore structuring, licensing, and compliance in Caribbean jurisdictions."
  },
  {
    id: 91,
    guest: "Erin West",
    title: "Return to the Frontlines: Crypto Crime in 2024",
    thumb: "assets/E91_ Erin West.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Deputy DA Erin West returns with an update from the frontlines of crypto crime prosecution — new scam typologies, the pig butchering epidemic, and the international cooperation needed to stop it.",
    bio: "Erin West is a Deputy District Attorney in Santa Clara County, California, recognized nationally for her work prosecuting cryptocurrency fraud. She is a leading voice on law enforcement's response to crypto crime."
  },
  {
    id: 92,
    guest: "Scott Thiel",
    title: "Asia-Pacific Crypto Law: Singapore, Hong Kong, and the Region's Race",
    thumb: "assets/E92_ Scott Thiel.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Scott Thiel on the competition between Singapore and Hong Kong for crypto leadership, how Asian regulators are approaching digital assets, and what the global industry can learn from the region's pragmatic approach.",
    bio: "Scott Thiel is a Partner at DLA Piper based in Hong Kong, where he leads the firm's Asia-Pacific crypto and blockchain practice, advising on digital asset regulations across the region."
  },
  {
    id: 93,
    guest: "Avishay Yanai",
    title: "Zero Knowledge: The Privacy Tech That Will Change Everything",
    thumb: "assets/E93_ Avishay Yanai.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Cryptographer Avishay Yanai on zero-knowledge proofs — what they actually are, why they matter for privacy and scalability, and how ZK technology will underpin the next generation of crypto applications.",
    bio: "Avishay Yanai is a cryptographer and researcher specializing in zero-knowledge proofs and multi-party computation. He is affiliated with leading academic and industry research groups in the field."
  },
  {
    id: 94,
    guest: "Itai Kanot",
    title: "Crypto Intelligence: How Blockchain Analytics Actually Works",
    thumb: "assets/E94_ Itai Kanot.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Itai Kanot on the world of blockchain intelligence, how analytics firms trace illicit funds, and the cat-and-mouse game between investigators and bad actors playing out on public blockchains every day.",
    bio: "Itai Kanot is a blockchain intelligence expert and co-founder of Bitfury Crystal, a leading blockchain analytics platform used by financial institutions and law enforcement worldwide."
  },
  {
    id: 95,
    guest: "Delphine Forma",
    title: "The French Touch: Crypto Regulation in Europe's Other Power",
    thumb: "assets/E95_ Delphine Forma.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Delphine Forma on France's forward-thinking approach to crypto regulation, the PSAN regime that predated MiCA, and how French policymakers are shaping the European digital asset landscape.",
    bio: "Delphine Forma is a French crypto regulatory attorney advising digital asset companies on French and European regulation, with expertise in the PSAN licensing regime and MiCA implementation."
  },
  {
    id: 98,
    guest: "Jonathan Benton",
    title: "AML in Crypto: The Compliance Professional's Reality",
    thumb: "assets/E98_ Jonathan Benton.jpg",
    apple: "#", spotify: "#", youtube: "#",
    desc: "Jonathan Benton on what a robust AML program for a crypto company actually requires, how FATF's Travel Rule is reshaping the industry, and what compliance professionals need to know that most lawyers won't tell them.",
    bio: "Jonathan Benton is an AML and compliance expert specializing in the crypto sector, having led compliance functions at major digital asset businesses and advised regulators on AML frameworks."
  },
  {
    id: 96,
    guest: "Russ Davis",
    title: "Shiba Inu Co-Founder on the $40B Meme Coin Explosion & What's Next",
    thumb: "assets/E96_ Russ Davis.jpg",
    apple: "#", spotify: "#", youtube: "https://youtu.be/wEKCX6zImqU",
    desc: "Shiba Inu co-founder Russ Davis on building one of the most improbable success stories in crypto, the psychology of meme coins, and what actually drives a $40 billion market cap beyond the hype.",
    bio: "Russ Davis is co-founder of the Shiba Inu project and a key architect of the broader ShibaArmy ecosystem. He is one of the most recognizable voices in meme coin culture and community-driven crypto projects."
  },
  {
    id: 97,
    guest: "Jacqueline Cooper",
    title: "Crypto Law, Bitcoin Mining Hacks & Digital Estate Planning",
    thumb: "assets/E97_ Jacqueline Cooper.jpg",
    apple: "#", spotify: "#", youtube: "https://youtu.be/0vd5u_qmptw",
    desc: "Attorney Jacqueline Cooper on the legal complexities of Bitcoin mining, what happens to your crypto when you die, and how digital estate planning is one of the most overlooked areas in the industry.",
    bio: "Jacqueline Cooper is a crypto and blockchain attorney specializing in digital estate planning, Bitcoin mining law, and regulatory compliance for digital asset businesses."
  },
  {
    id: 99,
    guest: "Ari Redbord",
    title: "How the US Tracks Crypto Crime — Inside the DOJ",
    thumb: "assets/E99_ Ari Redbord.jpg",
    apple: "#", spotify: "#", youtube: "https://youtu.be/qiH3TJzHKZs",
    desc: "Former DOJ prosecutor Ari Redbord on the government's evolving approach to crypto crime, how TRM Labs is helping trace illicit funds, and what law enforcement can and cannot see on the blockchain.",
    bio: "Ari Redbord is Head of Legal and Government Affairs at TRM Labs. He previously served as Senior Advisor to the Deputy Secretary and Under Secretary for Terrorism and Financial Intelligence at the U.S. Treasury Department."
  },
  {
    id: 100,
    guest: "Karen Knox",
    title: "From North Carolina to Tel Aviv: Faith, Insurance & Crypto",
    thumb: "assets/E100_ Karen Knox.jpg",
    apple: "#", spotify: "#", youtube: "https://youtu.be/7lHMd00_YyI",
    desc: "Karen Knox of Howden on her unlikely journey from North Carolina to the frontlines of crypto insurance in Tel Aviv, what institutional risk coverage for digital assets actually looks like, and why faith shapes her approach to an industry built on trustlessness.",
    bio: "Karen Knox is a senior executive at Howden, one of the world's leading insurance broking groups, where she focuses on digital asset and cryptocurrency risk management solutions."
  }
];
