const questions = [
/*    { 
        question: "What is the capital of France?", 
        options: ["Berlin", "Madrid", "Paris", "Rome"], 
        answer: "Paris",
        explanation: "Paris has been the capital of France since the 5th century." 
    },
    { 
        question: "Which planet is known as the Red Planet?", 
        options: ["Earth", "Mars", "Jupiter", "Venus"], 
        answer: "Mars",
        explanation: "Mars appears red due to iron oxide (rust) on its surface." 
    }, */
    { 
            question: "Brother Peter has recently been appointed as a fellowship leader. However, despite his efforts, he struggles in his ministry relying solely on physical strength. According to the teaching on anointing, what is most likely missing in his ministry?", 
            options: ["More financial support", "The anointing of the Holy Spirit", "More personal discipline", "A better understanding of doctrine", "The approval of his peers"], 
            answer: "The anointing of the Holy Spirit",
            explanation: "Ministry effectiveness relies on the empowerment of the Holy Spirit, not just human effort (Zechariah 4:6)." 
        },
        { 
            question: "Sister Joy is anointed and preaches powerfully but she often harbors bitterness and refuses to forgive others. What is the likely outcome of her ministry?", 
            options: ["She will be greatly rewarded despite her attitude", "She will remain effective as long as she prays", "Her anointing will gradually diminish", "Her bad character will have no effect on her ministry", "She will continue to increase in anointing and power"], 
            answer: "Her anointing will gradually diminish",
            explanation: "Unresolved sin and bitterness can quench the Holy Spirit's work (Ephesians 4:30-31)." 
        },
        { 
            question: "Brother Samuel always exhibits patience, gentleness, and humility when dealing with difficult people in the church. What biblical term best describes his character?", 
            options: ["Spiritual zeal", "The fruit of the Spirit", "A strong personality", "Ministerial intelligence", "Legalistic discipline"], 
            answer: "The fruit of the Spirit",
            explanation: "These qualities are listed as aspects of the Holy Spirit's work in a believer's life (Galatians 5:22-23)." 
        },
        { 
            question: "Brother James, a choir leader, secretly takes money from church offerings for personal use. According to biblical examples, which of the following best describes his potential downfall?", 
            options: ["He will be exposed and lose his position", "He will remain undetected and continue his ministry", "His anointing will protect him from consequences", "The church will increase financially despite his actions", "God will overlook it because of his singing talent"], 
            answer: "He will be exposed and lose his position",
            explanation: "Scripture shows that dishonesty in spiritual matters brings exposure and consequences (Acts 5:1-11)." 
        },
        
        { 
            question: "Sister Deborah is highly anointed but struggles with pride. What does the Bible say about the relationship between anointing and character?", 
            options: ["Anointing can compensate for bad character", "Divine character sustains anointing", "Pride strengthens a person's anointing", "Anointing makes character irrelevant", "Character and anointing are unrelated"], 
            answer: "Divine character sustains anointing",
            explanation: "The Bible teaches that humility and godly character are essential for sustaining anointing (Proverbs 16:18; James 4:6)." 
        },
        { 
            question: "Moses was a great leader anointed by God but failed to enter the Promised Land due to which character deficiency?", 
            options: ["Fear", "Anger", "Dishonesty", "Pride", "Laziness"], 
            answer: "Anger",
            explanation: "Moses struck the rock in anger instead of speaking to it as God commanded, which cost him entry into the Promised Land (Numbers 20:10-12)." 
        },
        { 
            question: "Brother Timothy has been dedicated to his calling but he has started compromising his faith because of his love for worldly pleasures. Which biblical figure had a similar downfall?", 
            options: ["Apostle Paul", "Elijah", "Demas", "Timothy", "Barnabas"], 
            answer: "Demas",
            explanation: "Demas abandoned Paul because he loved the world (2 Timothy 4:10)." 
        },
        { 
            question: "Gehazi, Elisha's servant, was positioned to receive a great anointing but lost his destiny because of what sin?", 
            options: ["Gossip", "Covetousness", "Fear", "Anger", "Dishonesty"], 
            answer: "Covetousness",
            explanation: "Gehazi lied and took gifts from Naaman out of greed, leading to judgment (2 Kings 5:20-27)." 
        },
        { 
            question: "Brother Emmanuel desires to grow in his anointing and character. According to the Bible, who is the perfect example he should follow?", 
            options: ["Moses", "Elijah", "Jesus Christ", "Apostle Peter", "John the Baptist"], 
            answer: "Jesus Christ",
            explanation: "Jesus is the ultimate model of anointing and godly character (Hebrews 12:2; 1 Peter 2:21)." 
        },
        
        { 
            question: "Sister Grace realizes she has character flaws that could affect her anointing. What should she do according to the prayer points provided?", 
            options: ["Ignore her flaws and focus on ministry", "Depend on her anointing to cover up her character flaws", "Pray for God to remove character deficiencies", "Blame others for her bad character", "Avoid serving in ministry altogether"], 
            answer: "Pray for God to remove character deficiencies",
            explanation: "The Bible encourages believers to seek God's transformative power to overcome weaknesses (Psalm 51:10; 2 Corinthians 12:9)." 
        },
        { 
            question: "A new academic session has just begun, and as an MFMCF worker, you notice that many freshmen seem lost and overwhelmed by campus life. According to the recommended evangelistic strategies, what is the best approach to reaching them before they adopt unhealthy campus influences?", 
            options: ["Organize a weekly Bible quiz competition", "Launch an immediate Freshers' Forum to engage them early", "Wait until they start having spiritual challenges before reaching out", "Focus only on those who show interest in church activities"], 
            answer: "Launch an immediate Freshers' Forum to engage them early",
            explanation: "Early engagement prevents negative influences and establishes spiritual foundations (Proverbs 22:6). Proactive outreach aligns with Jesus' model of seeking the lost (Luke 19:10)." 
        },
        { 
            question: "Your campus fellowship wants to hold a large crusade, but some members are skeptical about its effectiveness. According to the MFMCF evangelistic strategies, why is mass evangelism still an important approach?", 
            options: ["It allows reaching a large audience at once", "It is less time-consuming than personal evangelism", "It eliminates the need for follow-up discipleship", "It prevents opposition from other campus groups"], 
            answer: "It allows reaching a large audience at once",
            explanation: "Mass evangelism follows the biblical pattern of preaching to multitudes (Matthew 5:1–2, Acts 2:14–41), though it should be paired with discipleship (Matthew 28:19–20)." 
        },
        { 
            question: "A student has been avoiding Christian gatherings but frequently interacts on social media. What evangelistic strategy would be most effective in reaching him?", 
            options: ["Personal evangelism", "Mass evangelism", "Social Media Evangelism", "Literature Evangelism"], 
            answer: "Social Media Evangelism",
            explanation: "Meeting people where they are (online) reflects Paul's principle of adaptability (1 Corinthians 9:22). Digital platforms can bridge gaps for gospel outreach." 
        },
        { 
            question: "An MFMCF leader on campus notices that students are struggling with time management, which affects their spiritual growth. What type of evangelistic programme can be introduced to address this while sharing the gospel?", 
            options: ["Organizing a campus-wide music concert", "Hosting a Time Management Seminar with biblical principles", "Increasing the number of weekly services", "Preaching only during Sunday services"], 
            answer: "Hosting a Time Management Seminar with biblical principles",
            explanation: "Addressing practical needs with biblical wisdom mirrors Jesus' holistic ministry (Matthew 11:28–30). It opens doors for evangelism while providing value (Colossians 4:5–6)." 
        },
        
        { 
            question: "A sister in the fellowship expresses concern that many female students on campus feel isolated and lack mentorship. What is the best evangelistic strategy to engage and disciple them?",
            options: [
                "Organizing a Sisters' Forum to address their needs",
                "Asking them to attend general Sunday services",
                "Holding frequent deliverance services",
                "Focusing only on male evangelism since they are leaders"
            ],
            answer: "Organizing a Sisters' Forum to address their needs",
            explanation: "Targeted discipleship meets specific needs (Titus 2:3-5). Jesus ministered to women individually (John 4) and in groups (Luke 8:1-3), showing the importance of intentional engagement."
        },
        { 
            question: "During a campus outreach, an MFMCF worker encounters a student who is hesitant to attend services but is open to friendly interactions. Which evangelistic method would be most effective?",
            options: [
                "Friendship Evangelism – building trust through genuine love and care",
                "Forcing them to attend church services",
                "Preaching aggressively at them",
                "Ignoring them since they are uninterested"
            ],
            answer: "Friendship Evangelism – building trust through genuine love and care",
            explanation: "Jesus modeled relational evangelism (e.g., Zacchaeus in Luke 19:1-10). 1 Peter 3:15 emphasizes sharing faith through gentle, relationship-based opportunities."
        },
        { 
            question: "A student leader is passionate about evangelism but often neglects prayer and spiritual preparation. According to the prerequisites for effective strategies, what is missing in his approach?",
            options: [
                "Proper concerted supplication (prayer) before evangelism",
                "Enough social media advertisements",
                "More church decorations to attract students",
                "Engaging in only theoretical discussions"
            ],
            answer: "Proper concerted supplication (prayer) before evangelism",
            explanation: "Spiritual warfare requires prayer (Ephesians 6:18-19). The early church prioritized prayer before outreach (Acts 4:23-31), and Jesus taught that fruitfulness depends on abiding in Him (John 15:5)."
        },
        { 
            question: "Your fellowship is considering starting literature evangelism on campus. What key resource should be prayerfully distributed to ensure effectiveness?",
            options: [
                "Secular novels that teach good morals",
                "MFM publications like 'Fire in the Word' and books by Dr. D.K. Olukoya",
                "Random newspapers with motivational quotes",
                "Flyers with only the fellowship's service times"
            ],
            answer: "MFM publications like 'Fire in the Word' and books by Dr. D.K. Olukoya",
            explanation: "God's Word is powerful (Hebrews 4:12). Distributing biblically sound materials aligns with the Great Commission (Matthew 28:20) and follows the example of spreading godly instruction (2 Timothy 3:16-17)."
        },
        { 
            question: "An MFMCF campus fellowship notices an increase in student debates about different religious ideologies. Which strategy should be used to effectively engage in evangelism in this environment?",
            options: [
                "Campus Survey – understanding the spiritual landscape before evangelizing",
                "Criticizing other religious groups openly",
                "Using only personal opinions in discussions",
                "Avoiding evangelism completely to prevent conflicts"
            ],
            answer: "Campus Survey – understanding the spiritual landscape before evangelizing",
            explanation: "Paul's approach in Athens (Acts 17:22-23) demonstrates cultural awareness before preaching. Proverbs 18:13 warns against answering before listening. Surveys create bridges for gospel conversations."
        },
        
        { 
            question: "A fellowship leader is frustrated because some evangelistic efforts have failed. According to prescriptions for effective evangelism, what key mindset must they adopt?",
            options: [
                "Commitment and seriousness despite initial setbacks",
                "Giving up since no one responded immediately",
                "Only targeting students who are already interested in Christianity",
                "Avoiding evangelism completely"
            ],
            answer: "Commitment and seriousness despite initial setbacks",
            explanation: "Galatians 6:9 encourages believers not to grow weary in doing good, for in due season they will reap if they do not give up. Effective evangelism requires perseverance (Matthew 10:22)."
        },
        { 
            question: "Brother John used to be very active in church but recently he has stopped attending services, avoids Christian gatherings and rarely prays. His behavior aligns with which cause of backsliding?",
            options: [
                "Indiscipline and lack of self-control",
                "Lack of fellowship with one another",
                "Fear of persecution",
                "Overcommitment to secular work",
                "None of the above"
            ],
            answer: "Lack of fellowship with one another",
            explanation: "Hebrews 10:24-25 warns against forsaking the assembling of believers together. Isolation from Christian community often leads to spiritual decline (Proverbs 18:1)."
        },
        { 
            question: "Sister Mary who once led evangelism now finds it difficult to share her faith at school because she is afraid of being mocked. According to the text what is this an example of?",
            options: [
                "Unwillingness to confess Christ",
                "Fear of rejection",
                "Lack of knowledge",
                "Improper church training",
                "Justifiable caution"
            ],
            answer: "Fear of rejection",
            explanation: "2 Timothy 1:7-8 reminds us that God has not given us a spirit of fear. The fear of man brings a snare (Proverbs 29:25), but boldness comes from the Holy Spirit (Acts 4:31)."
        },
        { 
            question: "Brother James recently started dressing and behaving like unbelievers to fit in with his classmates. Which cause of backsliding does this reflect?",
            options: [
                "Desire to be independent",
                "Wanting to be like other nations",
                "Lack of personal conviction",
                "Poor discipleship",
                "None of the above"
            ],
            answer: "Wanting to be like other nations",
            explanation: "1 Samuel 8:5-7 shows the danger of wanting to be like others. Romans 12:2 commands believers not to conform to this world. Compromise with worldly standards leads to spiritual decline."
        },
        { 
            question: "Brother Samuel once known for his vibrant prayer life now struggles to pray and often feels spiritually dry. This is best described as:",
            options: [
                "Worldliness",
                "Indiscipline",
                "Prayerlessness",
                "Lack of self-control",
                "Backsliding by neglect"
            ],
            answer: "Backsliding by neglect",
            explanation: "Hebrews 2:1 warns against neglecting our salvation. Spiritual dryness often begins with neglecting prayer (1 Thessalonians 5:17) and other spiritual disciplines (2 Peter 1:5-8)."
        },
        
        { 
            question: "A backslidden sister argues that she can worship God privately and no longer needs to attend church or fellowship with others. What biblical warning does this contradict?",
            options: [
                "Hebrews 10:24-25 - Do not forsake the assembly of believers",
                "2 Timothy 2:22 - Flee youthful lusts",
                "John 3:16 - God so loved the world",
                "Revelation 3:16 - God will spew out the lukewarm",
                "Romans 12:1-2 - Present your body as a living sacrifice"
            ],
            answer: "Hebrews 10:24-25 - Do not forsake the assembly of believers",
            explanation: "The Bible explicitly warns against neglecting Christian fellowship (Hebrews 10:25). Proverbs 18:1 shows that isolation leads to spiritual danger, while Acts 2:42 demonstrates the early church's commitment to gathering together."
        },
        { 
            question: "Brother Peter used to be committed to his faith but he recently started justifying sin, arguing that 'God understands.' What is the potential consequence of this attitude?",
            options: [
                "Spiritual blindness and loss of heavenly vision",
                "Increased church responsibilities",
                "A more lenient judgment from God",
                "A deeper understanding of grace",
                "None of the above"
            ],
            answer: "Spiritual blindness and loss of heavenly vision",
            explanation: "1 John 1:8-10 warns that denying our sin deceives us. Hebrews 3:12-13 cautions against being hardened by sin's deceitfulness. Justifying sin leads to spiritual deterioration (Galatians 6:7-8)."
        },
        { 
            question: "A church member confesses to falling into sin repeatedly but refuses to acknowledge the need for repentance, arguing that he will change 'when the time is right.' What consequence does the Bible warn about for unrepentant backsliders?",
            options: [
                "Loss of heavenly inheritance",
                "Delayed blessings",
                "Reduced church attendance",
                "Temporary spiritual weakness",
                "Longer prayer sessions needed"
            ],
            answer: "Loss of heavenly inheritance",
            explanation: "Hebrews 10:26-27 warns of judgment for willful sin. Revelation 3:5 shows that names can be blotted from the Book of Life. Proverbs 28:13 emphasizes that concealing sins brings no prosperity, only confession and repentance do."
        },
        { 
            question: "After living in sin for a while, Sister Ruth realizes she has strayed from God and wants to return. According to the text, what is the first step in the restoration process?",
            options: [
                "Resolution to serve in church again",
                "Realisation of spiritual degeneration",
                "Attending church more frequently",
                "Increased fasting and prayer",
                "Avoiding people who remind her of her past"
            ],
            answer: "Realisation of spiritual degeneration",
            explanation: "2 Corinthians 7:10 shows godly sorrow produces repentance. The prodigal son 'came to himself' first (Luke 15:17) before returning. Recognition of one's fallen state precedes repentance (Revelation 3:17-18)."
        },
        { 
            question: "Brother David repents from backsliding and returns to God. However, he still keeps some sinful habits saying 'God knows I am trying.' According to the cure for backsliding, what essential step is he missing?",
            options: [
                "Realisation",
                "Renunciation",
                "Reception",
                "Fellowship",
                "Baptism"
            ],
            answer: "Renunciation",
            explanation: "2 Corinthians 7:1 calls for cleansing from all filthiness. Complete repentance requires forsaking sin (Proverbs 28:13). Partial obedience is disobedience (1 Samuel 15:22-23). True restoration demands full surrender (James 4:7-8)."
        },
        
        { 
            question: "Sister Joy rededicates her life to Christ and decides to remain strong in faith. According to the text, what is crucial for her to stay spiritually firm?",
            options: [
                "Remaining in Christ through personal fellowship and accountability",
                "Avoiding new friendships to prevent bad influences",
                "Attending church services without involvement",
                "Studying theology extensively",
                "Reading self-help books on discipline"
            ],
            answer: "Remaining in Christ through personal fellowship and accountability",
            explanation: "John 15:4-5 emphasizes abiding in Christ as the key to spiritual fruitfulness. Hebrews 10:24-25 stresses mutual encouragement among believers. Spiritual growth requires both vertical (with God) and horizontal (with other believers) relationships."
        },
        { 
            question: "John is a Christian student who often dreams of being a successful engineer but does not make concrete plans for his studies. He rarely studies, prays only when exams approach, and expects God to miraculously make him pass. Based on the principles of success in the text, what is John's main mistake?",
            options: [
                "He lacks a clear vision of his future",
                "He does not have faith in God's power",
                "He is not taking purposeful actions to achieve his goals",
                "He should rely only on divine intervention for success"
            ],
            answer: "He is not taking purposeful actions to achieve his goals",
            explanation: "James 2:17 teaches that faith without works is dead. Proverbs 21:5 shows that careful planning leads to advantage. While trusting God is essential (Proverbs 3:5-6), we must also diligently work (Colossians 3:23) as God's partners in achieving success."
        },
        { 
            question: "Sarah is an MFM Campus Fellowship leader who wants to be more effective in her ministry. She studies the life of Apostle Paul and notes his goal-oriented nature. Which of the following characteristics of Paul should Sarah adopt to succeed in her leadership?",
            options: [
                "Being passive and waiting for divine intervention",
                "Prioritizing comfort over responsibility",
                "Being resolute, disciplined and consistent",
                "Avoiding challenges to maintain peace"
            ],
            answer: "Being resolute, disciplined and consistent",
            explanation: "Philippians 3:13-14 shows Paul's focused determination. 1 Corinthians 9:24-27 illustrates his spiritual discipline. Effective ministry requires steadfastness (1 Corinthians 15:58) and consistency (Galatians 6:9) in pursuing God's calling."
        },
        { 
            question: "David is a university student in a challenging environment where ungodly influences are prevalent. He is determined to maintain his faith while excelling academically. According to the text, which of Daniel's qualities should David emulate to achieve success?",
            options: [
                "Complaining about the challenges around him",
                "Isolating himself completely from academic activities",
                "Being diligent, wise, prayerful and maintaining integrity",
                "Depending only on his intelligence and personal effort"
            ],
            answer: "Being diligent, wise, prayerful and maintaining integrity",
            explanation: "Daniel 1:8-20 demonstrates Daniel's balanced approach: excellence in secular learning (v. 17) combined with spiritual devotion (v. 8) and prayer (Daniel 6:10). His integrity (Daniel 6:4) and wisdom (Daniel 1:20) made him outstanding in both spiritual and academic realms."
        },
        { 
            question: "Deborah is a hardworking student who spends hours studying but struggles with anxiety about failing. She often relies solely on her strength, neglecting to trust in God. What does Proverbs 21:31 teach about achieving success?",
            options: [
                "Success is entirely based on personal effort",
                "Prayer alone guarantees success even without hard work",
                "While preparation is necessary, ultimate success comes from God",
                "Those who trust in God do not need to study"
            ],
            answer: "While preparation is necessary, ultimate success comes from God",
            explanation: "Proverbs 21:31 states: 'The horse is prepared for the day of battle, but the victory belongs to the LORD.' This teaches the balance between human responsibility (preparation) and divine sovereignty (ultimate success). Philippians 4:6-7 also encourages trusting God rather than being anxious."
        },
        
        { 
            question: "Ayo is preparing for his final exams and wants to succeed. Which of the following strategies aligns with the biblical principles of success outlined in the text?",
            options: [
                "Attending only revision classes and skipping earlier lectures",
                "Depending on last-minute cramming to pass exams",
                "Studying diligently from the beginning of the session planning effectively and relying on God",
                "Copying answers from others to ensure success"
            ],
            answer: "Studying diligently from the beginning of the session planning effectively and relying on God",
            explanation: "Proverbs 21:5 shows that careful planning leads to advantage, while Colossians 3:23 commands working heartily as for the Lord. Biblical success combines diligent effort (Proverbs 6:6-8) with trusting God (Proverbs 3:5-6)."
        },
        { 
            question: "Daniel is writing an exam but spends too much time on one question causing him to rush through the rest. Based on the principles outlined in the text what should he have done?",
            options: [
                "Pray and expect divine inspiration for all answers",
                "Read all questions carefully, allocate time wisely and maintain accuracy",
                "Answer only the questions he finds easy and skip the hard ones",
                "Focus only on his favorite subject and ignore the rest"
            ],
            answer: "Read all questions carefully, allocate time wisely and maintain accuracy",
            explanation: "Ecclesiastes 8:5-6 emphasizes the wisdom of proper timing and judgment. Luke 14:28-30 illustrates the importance of counting the cost beforehand. Effective exam strategy reflects biblical wisdom in stewardship of time and resources (Ephesians 5:15-16)."
        },
        { 
            question: "Jane has failed a few exams and now believes she is destined to be a failure. She is starting to give up on her studies. Based on Matthew 8:2 and 3 John 2 what should Jane understand about success?",
            options: [
                "Failure is God's punishment for past mistakes",
                "Some people are created to fail and she should accept it",
                "Success is God's will for every believer and she should keep striving",
                "God only helps those who succeed effortlessly"
            ],
            answer: "Success is God's will for every believer and she should keep striving",
            explanation: "3 John 1:2 confirms God desires our prosperity in all things. Matthew 8:2-3 shows Jesus' willingness to restore what is broken. Romans 8:37 assures we are more than conquerors through Christ. Temporary setbacks don't define our destiny (Philippians 3:13-14)."
        },
        { 
            question: "Michael wants to improve his spiritual life while maintaining academic excellence. What is the best approach based on the principles outlined in the text?",
            options: [
                "Praying for academic success but making no effort to study",
                "Setting tangible long-term, intermediate and short-term goals while relying on God",
                "Focusing only on academic success and ignoring spiritual growth",
                "Studying hard but avoiding prayer and fellowship to save time"
            ],
            answer: "Setting tangible long-term, intermediate and short-term goals while relying on God",
            explanation: "Habakkuk 2:2-3 teaches the power of writing the vision. Proverbs 16:3 encourages committing plans to the Lord. Daniel's example (Daniel 1:17-20) shows that spiritual devotion and academic excellence can coexist when properly balanced."
        },
        { 
            question: "Tolu believes that since God desires his success, he does not need to study but should instead focus only on prayers and fasting. What does Psalm 37:3 teach about achieving success?",
            options: [
                "Success is only for those who work hard without trusting God",
                "Trusting in God does not require preparation",
                "A combination of diligent effort and faith in God leads to success",
                "Only spiritual success matters, not academic success"
            ],
            answer: "A combination of diligent effort and faith in God leads to success",
            explanation: "Psalm 37:3 says 'Trust in the LORD and do good.' This shows the dual requirement of faith and action. 2 Thessalonians 3:10 warns against idleness. Biblical success requires both dependence on God (John 15:5) and diligent labor (Proverbs 13:4)."
        },
        
        { 
            question: "Joshua aspires to be a future leader in MFM Campus Fellowship. Which principle from the text should he apply to be effective?",
            options: [
                "Wait for leadership opportunities without preparation",
                "Develop himself through discipline, diligence, and total dependence on God",
                "Depend only on spiritual gifts and neglect practical leadership skills",
                "Avoid responsibilities so as not to face challenges"
            ],
            answer: "Develop himself through discipline, diligence, and total dependence on God",
            explanation: "1 Timothy 4:12-16 emphasizes both godliness and diligent development. Biblical leadership requires balanced growth in character (Titus 1:7-9) and competence (Exodus 18:21), always depending on God (Zechariah 4:6)."
        },
        { 
            question: "A group of members in your fellowship is arguing over a new doctrinal teaching that seems to contradict previous teachings. Some members support it, while others reject it. As a leader, what should be your FIRST approach?",
            options: [
                "Dismiss the issue and continue with regular fellowship activities",
                "Call for a debate to let both sides argue their points",
                "Search the Scriptures for guidance and use sound doctrinal teaching to clarify the issue",
                "Ask the members to vote on whether to accept or reject the doctrine"
            ],
            answer: "Search the Scriptures for guidance and use sound doctrinal teaching to clarify the issue",
            explanation: "Acts 17:11 commends examining Scripture for truth. 2 Timothy 2:15 emphasizes correct handling of God's word. Doctrinal disputes require biblical resolution (Titus 1:9), not opinions or votes."
        },
        { 
            question: "A senior member of the fellowship believes he should be the leader and secretly gathers support against the current leader. This has caused division and strife in the group. What is the BEST biblical approach to handle this?",
            options: [
                "Confront the person in public and rebuke him before the congregation",
                "Address the issue in a private discussion and seek a resolution based on biblical principles",
                "Expel the member immediately from the fellowship to prevent further damage",
                "Ignore the issue and focus on spiritual matters"
            ],
            answer: "Address the issue in a private discussion and seek a resolution based on biblical principles",
            explanation: "Matthew 18:15-17 outlines conflict resolution starting privately. Galatians 6:1 calls for gentle restoration. Public confrontation should be last resort (1 Timothy 5:20)."
        },
        { 
            question: "There are allegations that the fellowship treasurer has misused funds meant for outreach programs. How should the leadership handle this issue?",
            options: [
                "Call for a public meeting and openly accuse the treasurer",
                "Pray about it and wait for God’s judgment",
                "Constitute a committee to investigate the matter thoroughly before taking action",
                "Immediately remove the treasurer and appoint a new one without further discussion"
            ],
            answer: "Constitute a committee to investigate the matter thoroughly before taking action",
            explanation: "Deuteronomy 19:15 requires proper investigation. 1 Timothy 5:19 warns against hasty accusations. Accountability structures (Acts 6:1-7) ensure transparency in financial matters."
        },
        { 
            question: "Two key members of the fellowship have a serious disagreement over a personal matter, and this is affecting the unity of the group. What should the leader do?",
            options: [
                "Encourage them to discuss their differences privately and seek reconciliation",
                "Take sides with the person who is more spiritually mature",
                "Ask both members to leave the fellowship until they resolve their issue",
                "Ignore the dispute and let them handle it on their own"
            ],
            answer: "Encourage them to discuss their differences privately and seek reconciliation",
            explanation: "Matthew 5:23-24 prioritizes reconciliation. Ephesians 4:3 commands preserving unity. Leaders should facilitate peacemaking (Romans 14:19) without taking sides (James 2:1)."
        },
        { 
            question: "A well-respected member of the fellowship has been caught in an immoral act. Some members believe he should be expelled, while others argue for mercy. What should be the leadership's response?",
            options: [
                "Address the issue privately through counseling, prayer, and correction according to biblical standards",
                "Immediately announce the person’s sin before the entire fellowship",
                "Ignore the issue to prevent division in the group",
                "Ask the member to leave permanently without any discussion"
            ],
            answer: "Address the issue privately through counseling, prayer, and correction according to biblical standards",
            explanation: "Galatians 6:1-2 instructs restoring sinners gently. 2 Corinthians 2:6-8 shows discipline aims at redemption. Public exposure is only for unrepentant sin (1 Timothy 5:20)."
        },
        { 
            question: "The university administration has banned public gatherings of the fellowship, threatening to expel any student who attends meetings. What is the BEST course of action?",
            options: [
                "Disband the fellowship to avoid confrontation",
                "Continue meeting in secret without informing anyone",
                "Seek legal or administrative counsel while committing the matter to prayer",
                "Confront the authorities and demand your rights aggressively"
            ],
            answer: "Seek legal or administrative counsel while committing the matter to prayer",
            explanation: "Acts 22:25 shows Paul appealing to legal rights. Matthew 10:16 advises wisdom amid persecution. Prayer (Acts 4:23-31) and diplomacy (1 Timothy 2:1-2) should precede confrontation."
        },
        { 
            question: "A new executive member of the fellowship feels sidelined because he was not consulted in recent decisions. He is becoming resentful and passive-aggressive in meetings. What should the fellowship leader do?",
            options: [
                "Publicly rebuke him for his attitude",
                "Call him for a private discussion to understand his concerns and clarify his role",
                "Remove him from leadership to prevent further disruption",
                "Ignore his behavior and hope he adjusts over time"
            ],
            answer: "Call him for a private discussion to understand his concerns and clarify his role",
            explanation: "Philippians 2:3-4 values others' perspectives. Proverbs 15:1 teaches gentle answers defuse anger. Private resolution follows Jesus' model (Matthew 18:15) before escalation."
        },
        { 
            question: "Some members of the fellowship are advocating for the inclusion of modern trends, such as allowing worldly music and dressing styles, to attract more students. What should the leader do?",
            options: [
                "Allow the changes to make the fellowship more appealing",
                "Strictly enforce conservative traditions without explanation",
                "Teach sound doctrine emphasizing biblical principles on holiness and separation from worldly practices",
                "Let members decide individually how they want to worship"
            ],
            answer: "Teach sound doctrine emphasizing biblical principles on holiness and separation from worldly practices",
            explanation: "Romans 12:2 commands nonconformity to the world. 1 Peter 1:15-16 calls for holiness. Leaders must uphold biblical standards (Titus 2:7-8) while explaining their purpose (1 Peter 3:15)."
        },
        { 
            question: "Some members believe in open-air preaching, while others prefer one-on-one evangelism. This disagreement has led to division in the evangelism team. What is the BEST way to handle this?",
            options: [
                "Allow both methods to coexist while ensuring unity in the team",
                "Choose one method and enforce it as the only acceptable approach",
                "Disband the evangelism team until they can agree on a method",
                "Vote on which method to use going forward"
            ],
            answer: "Allow both methods to coexist while ensuring unity in the team",
            explanation: "1 Corinthians 12:4-6 shows diversity in ministry methods. Ephesians 4:3-6 maintains unity amid diversity. Both mass (Acts 2:14-41) and personal (John 4:7-26) evangelism are biblical."
        },
        { 
            question: "Many fellowship members are struggling academically, and some have started skipping meetings to focus on their studies. How should the leadership respond?",
            options: [
                "Organize academic support programs while emphasizing time management",
                "Condemn them for prioritizing studies over God’s work",
                "Reduce the number of fellowship meetings permanently",
                "Ignore the issue since academics is a personal matter"
            ],
            answer: "Organize academic support programs while emphasizing time management",
            explanation: "Ecclesiastes 9:10 encourages excellence in labor. Daniel 1:17-20 models balancing spiritual and academic pursuits. The church should support holistic growth (Luke 2:52)."
        },
        
    {
        question: "The red colour depicts the Holy spirit tongue of Fire as depicted in",
        options: [
            "Acts 1: 2 - 4",
            "Acts 1: 5 - 8",
            "Acts 2: 5 - 8",
            "Acts 2: 3"
        ],
        answer: "Acts 2: 3",
        explanation: "Acts 2:3 describes the tongues of fire that appeared on the day of Pentecost, symbolizing the Holy Spirit."
    },
    {
        question: "The Black Colour depicts",
        options: [
            "The world",
            "The mountains",
            "The earth",
            "The mountain top"
        ],
        answer: "The mountain top",
        explanation: "The black colour is associated with the mountain top, though the specific symbolism may vary by context."
    },
    {
        question: "Royalty is depicted by the",
        options: [
            "White colour",
            "Pink colour",
            "Red colour",
            "Purple colour"
        ],
        answer: "Purple colour",
        explanation: "Purple has historically been associated with royalty due to the rarity and cost of purple dye in ancient times."
    },
    {
        question: "The white colour is for holiness within only",
        "options": [
            "True",
            "False",
            "Maybe",
            "Not entirely true"
        ],
        answer: "Not entirely true",
        explanation: "White often symbolizes holiness, but its meaning is not limited to internal holiness alone; it can represent purity in broader contexts."
    },
    {
        question: "The soul winning field for end time soldiers is depicted by",
        options: [
            "The mountains",
            "The circle",
            "The fire",
            "The 'ministries'"
        ],
        answer: "The circle",
        explanation: "The circle is used to symbolize the soul-winning field, representing the encompassing and global nature of the mission."
    },
    {
        question: "One of this is not a doctrine of MFM",
        options: [
            "The final judgement",
            "The baptism of the holy spirit",
            "The 200-day reign of Christ",
            "The New Heaven and Earth"
        ],
        answer: "The 200-day reign of Christ",
        explanation: "The 200-day reign of Christ is not a standard doctrine in most mainstream Christian teachings, including MFM."
    },
    {
        question: "The Basis of our faith and Fellowship can be attributed to",
        options: [
            "MFM",
            "Our family",
            "The Scriptures",
            "Our G O"
        ],
        answer: "The Scriptures",
        explanation: "The Scriptures are the foundational basis of Christian faith and fellowship, as they are the inspired word of God."
    }
    
    
    
    
    // Your questions will be here
    // Add more questions...
];

let currentPage = 0;
const questionsPerPage = 10;
let userAnswers = new Array(questions.length).fill(null);
let startTime = Date.now();
let examDuration = 35 * 60; // 35 minutes in seconds
let timerInterval;
let blurWarningCount = 0;
let isSubmitting = false;
let examSubmitted = false;

// Get user info from storage (set in registration page)
function getUserInfo() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || 
                    JSON.parse(localStorage.getItem('userInfo')) || {
        fullName: "Anonymous User",
        matricNumber: "N/A",
        department: "N/A",
        level: "N/A"
    };
    
    return userInfo;
}

// Display user information in the card
function displayUserInfo() {
    const userInfo = getUserInfo();
    const userInfoContent = document.getElementById('user-info-content');
    
    userInfoContent.innerHTML = `
        <div class="user-info-item">
            <div class="user-info-label">Name:</div>
            <div>${userInfo.fullName}</div>
        </div>
        <div class="user-info-item">
            <div class="user-info-label">Matric No:</div>
            <div>${userInfo.matricNumber}</div>
        </div>
        <div class="user-info-item">
            <div class="user-info-label">Department:</div>
            <div>${userInfo.department}</div>
        </div>
        <div class="user-info-item">
            <div class="user-info-label">Level:</div>
            <div>${userInfo.level}</div>
        </div>
    `;
}

// Timer functionality
function startTimer() {
    const timerElement = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const remainingSeconds = examDuration - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            showToast('Time is up! Submitting your exam...', 'warning');
            setTimeout(() => {
                submitExam(true);
            }, 1000);
            return;
        }
        
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Warning when time is running out
        if (remainingSeconds === 300) { // 5 minutes
            showToast('You have 5 minutes remaining!', 'warning');
        } else if (remainingSeconds === 60) { // 1 minute
            showToast('Only 1 minute left!', 'error');
        }
    }, 1000);
}

function renderQuestions() {
    const start = currentPage * questionsPerPage;
    const end = Math.min(start + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(start, end);

    const container = document.getElementById("question-container");
    container.innerHTML = "";

    currentQuestions.forEach((q, index) => {
        const questionIndex = start + index;
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";
        questionDiv.innerHTML = `
            <div class="question-header">
                <p><strong>${questionIndex + 1}. ${q.question}</strong></p>
            </div>
            <div class="options">
                ${q.options.map((option, optIndex) =>
                    `<label class="option">
                        <input type="radio" name="q${questionIndex}" value="${option}" ${userAnswers[questionIndex] === option ? "checked" : ""}>
                        <span class="option-text">${option}</span>
                    </label>`
                ).join("")}
            </div>
        `;
        container.appendChild(questionDiv);
    });

    updatePaginationInfo();
    updateProgressTracker();
    updateAnsweredCount();
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    document.getElementById("pagination-text").textContent = `Page ${currentPage + 1} of ${totalPages}`;
    
    const start = currentPage * questionsPerPage + 1;
    const end = Math.min((currentPage + 1) * questionsPerPage, questions.length);
    document.getElementById("progress-text").textContent = `Question ${start}-${end} of ${questions.length}`;
    
    document.getElementById("prev-btn").disabled = currentPage === 0;
    document.getElementById("next-btn").style.display = currentPage < totalPages - 1 ? "inline-flex" : "none";
    document.getElementById("submit-btn").style.display = currentPage === totalPages - 1 ? "inline-flex" : "none";
}

function updateProgressTracker() {
    // This function could be expanded with a visual progress bar
}

function updateAnsweredCount() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    document.getElementById("answered-count").textContent = `${answeredCount} of ${questions.length} answered`;
}

function saveUserAnswers() {
    document.querySelectorAll("#question-container input[type='radio']:checked").forEach(input => {
        const questionIndex = parseInt(input.name.replace("q", ""));
        userAnswers[questionIndex] = input.value;
    });
    updateAnsweredCount();
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    switch(type) {
        case 'success': 
            icon = '<i class="fas fa-check-circle toast-icon"></i>';
            break;
        case 'warning': 
            icon = '<i class="fas fa-exclamation-triangle toast-icon"></i>';
            break;
        case 'error': 
            icon = '<i class="fas fa-times-circle toast-icon"></i>';
            break;
        default: 
            icon = '<i class="fas fa-info-circle toast-icon"></i>';
    }
    
    toast.innerHTML = `
        ${icon}
        <div class="toast-message">${message}</div>
        <div class="toast-close">&times;</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add fade-in effect
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Auto dismiss after duration
    const timeout = setTimeout(() => {
        dismissToast(toast);
    }, duration);
    
    // Manual dismiss
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.add('fade-out');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Anti-cheat: Tab/Window visibility handling
function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && !examSubmitted) {
            blurWarningCount++;
            
            if (blurWarningCount === 1) {
                showToast('Warning: Navigating away from this tab is not allowed!', 'warning');
            } else if (blurWarningCount === 2) {
                showToast('Second warning: Your exam may be submitted automatically if you leave again!', 'error');
            } else if (blurWarningCount >= 3) {
                showToast('Final warning! Your exam is being submitted automatically.', 'error');
                setTimeout(() => {
                    submitExam(true);
                }, 1000);
            }
        }
    });

    // Detect fullscreen exit
    window.addEventListener('resize', () => {
        if (!document.fullscreenElement && !examSubmitted) {
            showToast('Warning: Maintaining full screen is recommended.', 'info');
        }
    });
}

// Lock screen for security violations
function showLockScreen(message, autoSubmit = false) {
    const lockScreen = document.createElement('div');
    lockScreen.className = 'lock-screen';
    lockScreen.innerHTML = `
        <i class="fas fa-lock lock-icon"></i>
        <div class="lock-message">Security Alert</div>
        <div class="lock-warning">${message}</div>
        <button class="lock-button" id="lock-continue-btn">Continue Exam</button>
    `;
    
    document.body.appendChild(lockScreen);
    
    document.getElementById('lock-continue-btn').addEventListener('click', () => {
        if (autoSubmit) {
            submitExam(true);
        } else {
            document.body.removeChild(lockScreen);
        }
    });
}

// Submit exam function
function submitExam(isAutoSubmit = false) {
    if (isSubmitting) return; // Prevent double submission
    isSubmitting = true;
    examSubmitted = true;
    
    saveUserAnswers();
    clearInterval(timerInterval);
    
    // Prepare submission message
    let submitMessage = isAutoSubmit ? 
        'Your exam is being submitted automatically.' : 
        'Submitting your exam...';
    
    showToast(submitMessage, isAutoSubmit ? 'warning' : 'info');
    
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    // Grade exam and prepare results
    setTimeout(() => {
        gradeAndRedirect();
    }, 1500);
}

function gradeAndRedirect() {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds
    
    const userInfo = getUserInfo();
    userInfo.timeTaken = timeTaken;
    
    const examResults = {
        userInfo: userInfo,
        questions: questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.answer;
            
            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.answer,
                userAnswer: userAnswer,
                isCorrect: isCorrect,
                explanation: q.explanation || ""
            };
        }),
        submittedAt: new Date().toISOString(),
        preventRetake: true
    };
    
    // Save to both storage types for redundancy
    sessionStorage.setItem('examResults', JSON.stringify(examResults));
    localStorage.setItem('examResults', JSON.stringify(examResults));
    
    // Ensure data is saved before redirect
    setTimeout(() => {
        window.location.href = "result.html";
    }, 500);
}

// Navigation button event listeners
document.getElementById("next-btn").addEventListener("click", () => {
    saveUserAnswers();
    currentPage++;
    renderQuestions();
    
    // Scroll to top of question container
    document.getElementById("question-container").scrollIntoView({ behavior: 'smooth' });
});

document.getElementById("prev-btn").addEventListener("click", () => {
    saveUserAnswers();
    currentPage--;
    renderQuestions();
    
    // Scroll to top of question container
    document.getElementById("question-container").scrollIntoView({ behavior: 'smooth' });
});

document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    saveUserAnswers();
    
    // Check if all questions are answered
    const unansweredCount = userAnswers.filter(answer => answer === null).length;
    if (unansweredCount > 0) {
        showToast(`You have ${unansweredCount} unanswered questions. Please review before submitting.`, 'warning');
        
        if (confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
            submitExam();
        }
    } else {
        if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
            submitExam();
        }
    }
});

// Prevent navigation using browser back/forward buttons
function setupNavigationPrevention() {
    window.history.pushState(null, null, window.location.href);
    
    window.addEventListener('popstate', function(event) {
        window.history.pushState(null, null, window.location.href);
        showToast('Navigation using browser buttons is disabled during the exam.', 'error');
    });
}

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showToast('Right-clicking is disabled during the exam.', 'warning');
});

// Prevent keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent Ctrl+A (Select All)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        showToast('Select All is disabled during the exam.', 'warning');
    }
    
    // Prevent Ctrl+C (Copy)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        showToast('Copying is disabled during the exam.', 'warning');
    }
    
    // Prevent Ctrl+V (Paste)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        showToast('Pasting is disabled during the exam.', 'warning');
    }
    
    // Prevent Alt+Tab directly is not possible, but we detect window blur instead
    
    // Prevent F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
        showToast('Developer Tools are disabled during the exam.', 'error');
    }
});

// Initialize the exam
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is coming from registration
    if (!sessionStorage.getItem('userInfo') && !localStorage.getItem('userInfo')) {
        alert('Please register first before taking the exam');
        window.location.href = 'index.html';
        return;
    }
    
    // Check if user already completed the exam
    const examResults = JSON.parse(sessionStorage.getItem('examResults')) || 
                        JSON.parse(localStorage.getItem('examResults'));
    
    if (examResults && examResults.preventRetake) {
        showLockScreen('You have already completed this exam. You cannot retake it.', true);
        return;
    }
    
    // Initialize everything
    startTime = Date.now();
    displayUserInfo();
    renderQuestions();
    startTimer();
    setupVisibilityTracking();
    setupNavigationPrevention();
    
    // Welcome toast
    showToast('Welcome to the exam. You have 35 minutes to complete all questions.', 'info', 8000);
    
    // Prevent accidental navigation away
    window.addEventListener('beforeunload', (e) => {
        if (!examSubmitted) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
        }
    });
});
