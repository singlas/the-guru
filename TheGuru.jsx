import { useState, useEffect, useCallback, useRef } from "react";

// ─── CARD DATA (136 Scenarios + 80 Wisdom) ───
const SCENARIOS=[{id:101,cat:"Personal Dilemmas",text:"You\u2019re feeling unfulfilled despite professional success. How do you find fulfillment?",score:3},{id:102,cat:"Personal Dilemmas",text:"You\u2019re struggling with anxiety about the future. What should guide you?",score:4},{id:103,cat:"Personal Dilemmas",text:"You\u2019re dealing with procrastination. How can you find motivation?",score:2},{id:104,cat:"Personal Dilemmas",text:"You face self-doubt after failing repeatedly. What perspective helps you continue?",score:4},{id:105,cat:"Personal Dilemmas",text:"You feel misunderstood by friends. How should you cope with this feeling?",score:2},{id:106,cat:"Personal Dilemmas",text:"You\u2019re losing patience frequently. What wisdom guides you back to calm?",score:2},{id:107,cat:"Personal Dilemmas",text:"You notice envy toward someone close. How should you handle it?",score:3},{id:108,cat:"Personal Dilemmas",text:"You struggle to maintain healthy habits. What wisdom helps you stay disciplined?",score:1},{id:109,cat:"Personal Dilemmas",text:"How do you handle boredom without slipping into unhealthy habits?",score:2},{id:110,cat:"Personal Dilemmas",text:"You often regret past decisions. How do you move forward?",score:1},{id:111,cat:"Personal Dilemmas",text:"How should you balance personal ambitions with family responsibilities?",score:4},{id:112,cat:"Personal Dilemmas",text:"You\u2019re struggling to forgive yourself. How do you find inner peace?",score:5},{id:113,cat:"Personal Dilemmas",text:"You are tempted to ignore problems rather than facing them. What wisdom helps here?",score:3},{id:114,cat:"Personal Dilemmas",text:"How do you find strength during periods of loneliness?",score:3},{id:115,cat:"Personal Dilemmas",text:"You experience fear of failure frequently. How can you overcome this fear?",score:4},{id:201,cat:"Professional Challenges",text:"Your efforts go unnoticed at work. What mindset helps you remain motivated?",score:3},{id:202,cat:"Professional Challenges",text:"You receive harsh criticism from your manager. How do you react constructively?",score:4},{id:203,cat:"Professional Challenges",text:"You\u2019re overloaded with work. What wisdom guides you to balance?",score:3},{id:204,cat:"Professional Challenges",text:"You\u2019re facing a difficult team member. How do you approach this situation positively?",score:4},{id:205,cat:"Professional Challenges",text:"You must choose between career growth and personal ethics. What guides your choice?",score:5},{id:206,cat:"Professional Challenges",text:"How do you handle a scenario where you\u2019re wrongly blamed for a failure at work?",score:4},{id:207,cat:"Professional Challenges",text:"Your coworker takes credit for your idea. What wisdom guides your reaction?",score:2},{id:208,cat:"Professional Challenges",text:"You\u2019re stuck in a routine job. How can you find meaning or growth?",score:1},{id:209,cat:"Professional Challenges",text:"You must decide whether to risk your job security for a potential opportunity.",score:5},{id:210,cat:"Professional Challenges",text:"How should you deal with workplace gossip?",score:1},{id:211,cat:"Professional Challenges",text:"You\u2019re offered a promotion involving unethical practices. How should you respond?",score:5},{id:212,cat:"Professional Challenges",text:"Your team\u2019s morale is low. How do you inspire them positively?",score:3},{id:213,cat:"Professional Challenges",text:"You\u2019re repeatedly overlooked for opportunities. What wisdom helps you cope?",score:2},{id:214,cat:"Professional Challenges",text:"How should you respond when your hard work fails to produce immediate results?",score:4},{id:215,cat:"Professional Challenges",text:"You face conflict between work deadlines and family time. What wisdom helps?",score:3},{id:301,cat:"Moral/Ethical Decisions",text:"You witness someone cheating. Do you intervene or stay silent?",score:4},{id:302,cat:"Moral/Ethical Decisions",text:"You\u2019re asked to bend the truth for a friend. What do you do?",score:2},{id:303,cat:"Moral/Ethical Decisions",text:"A rule seems unfair. Do you follow it anyway or challenge it?",score:2},{id:304,cat:"Moral/Ethical Decisions",text:"You\u2019re offered a shortcut that violates your values. What guides your response?",score:5},{id:305,cat:"Moral/Ethical Decisions",text:"You made a mistake that harmed someone. Do you admit it or hide it?",score:4},{id:306,cat:"Moral/Ethical Decisions",text:"You benefit from an unfair situation. Do you speak up or stay silent?",score:5},{id:307,cat:"Moral/Ethical Decisions",text:"A loved one asks you to do something unethical. What guides your choice?",score:4},{id:308,cat:"Moral/Ethical Decisions",text:"You\u2019re in a position of power. How do you ensure fairness to all?",score:2},{id:309,cat:"Moral/Ethical Decisions",text:"You see someone being unfairly treated. Do you risk your position to help them?",score:5},{id:310,cat:"Moral/Ethical Decisions",text:"You feel tempted to gossip. How do you resist the urge?",score:1},{id:311,cat:"Moral/Ethical Decisions",text:"You made a promise that\u2019s now difficult to keep. What should guide your action?",score:3},{id:312,cat:"Moral/Ethical Decisions",text:"You are being pressured to conform to a group\u2019s unethical decision. What should you do?",score:5},{id:313,cat:"Moral/Ethical Decisions",text:"You feel anger toward someone who wronged you. Do you seek revenge or forgiveness?",score:3},{id:314,cat:"Moral/Ethical Decisions",text:"You find a wallet full of money and no ID. Do you keep it or turn it in?",score:1},{id:315,cat:"Moral/Ethical Decisions",text:"You\u2019re tempted to take credit for something you didn\u2019t do. What grounds your integrity?",score:4},{id:401,cat:"Relationship Situations",text:"Your friend starts avoiding you without explanation. How do you handle it?",score:1},{id:402,cat:"Relationship Situations",text:"You feel resentment growing in a close relationship. What should you do?",score:3},{id:403,cat:"Relationship Situations",text:"A disagreement with your sibling is getting out of hand. How do you bring peace?",score:2},{id:404,cat:"Relationship Situations",text:"You need to give difficult feedback to someone you care about. How do you communicate wisely?",score:4},{id:405,cat:"Relationship Situations",text:"You feel unappreciated by your partner. How do you address it constructively?",score:4},{id:406,cat:"Relationship Situations",text:"A friend spreads a rumor about you. What\u2019s the wisest way to respond?",score:3},{id:407,cat:"Relationship Situations",text:"You and your partner have different spiritual beliefs. How do you stay connected?",score:2},{id:408,cat:"Relationship Situations",text:"You need more space in a relationship but fear hurting the other person.",score:4},{id:409,cat:"Relationship Situations",text:"A loved one constantly criticizes your choices. How do you maintain love and boundaries?",score:5},{id:410,cat:"Relationship Situations",text:"A parent disapproves of your life decisions. How do you stay true while respecting them?",score:5},{id:411,cat:"Relationship Situations",text:"Your child is not listening to you. What wisdom helps you remain patient and loving?",score:2},{id:412,cat:"Relationship Situations",text:"You feel distant from someone you used to be close to. How do you reconnect?",score:3},{id:413,cat:"Relationship Situations",text:"You\u2019re in a toxic friendship. What\u2019s the right way to exit with compassion?",score:4},{id:414,cat:"Relationship Situations",text:"You hurt someone unintentionally. How do you make amends?",score:3},{id:415,cat:"Relationship Situations",text:"You feel jealous seeing a friend succeed. How do you preserve love and joy?",score:1},{id:501,cat:"Wealth & Simplicity",text:"You feel pressure to maintain a lifestyle that exceeds your means. What helps you simplify?",score:3},{id:502,cat:"Wealth & Simplicity",text:"You struggle to be generous, fearing you won\u2019t have enough. How do you shift your mindset?",score:4},{id:503,cat:"Wealth & Simplicity",text:"You\u2019re tempted to pursue a higher-paying job that compromises your peace of mind.",score:5},{id:504,cat:"Wealth & Simplicity",text:"You\u2019ve accumulated wealth but feel a sense of emptiness. How do you reconnect with purpose?",score:4},{id:505,cat:"Wealth & Simplicity",text:"You want to give to a cause but are unsure it\u2019s the right time. What wisdom helps?",score:2},{id:506,cat:"Wealth & Simplicity",text:"You\u2019re comparing your material success to others. How do you ground yourself?",score:2},{id:507,cat:"Wealth & Simplicity",text:"You feel guilty spending on yourself. What perspective can bring balance?",score:1},{id:508,cat:"Wealth & Simplicity",text:"You\u2019re constantly worried about financial security. What helps bring peace?",score:4},{id:509,cat:"Wealth & Simplicity",text:"You\u2019re consumed by desire for more possessions. How can you shift to contentment?",score:4},{id:510,cat:"Wealth & Simplicity",text:"You\u2019re conflicted between saving and supporting someone in need.",score:5},{id:511,cat:"Wealth & Simplicity",text:"You see someone flaunting their wealth. How do you keep your humility?",score:1},{id:512,cat:"Wealth & Simplicity",text:"You\u2019ve received an unexpected windfall. How do you decide what to do with it?",score:3},{id:513,cat:"Wealth & Simplicity",text:"You\u2019re offered a bribe that could solve many of your problems. What guides your integrity?",score:5},{id:514,cat:"Wealth & Simplicity",text:"Your friend is becoming materialistic. How can you gently guide them?",score:2},{id:515,cat:"Wealth & Simplicity",text:"You fear you\u2019ll never have \u2018enough.\u2019 How do you define true abundance?",score:4},{id:516,cat:"Wealth & Simplicity",text:"You want to live simply, but society pushes you to show success. What grounds you?",score:3},{id:601,cat:"Spiritual Growth",text:"You\u2019re losing interest in your spiritual practice. How do you regain discipline and joy?",score:4},{id:602,cat:"Spiritual Growth",text:"You want to deepen your connection with the divine. Where do you begin?",score:3},{id:603,cat:"Spiritual Growth",text:"You feel spiritually stuck despite consistent effort. What helps you move forward?",score:4},{id:604,cat:"Spiritual Growth",text:"You\u2019re distracted during meditation. What wisdom brings focus?",score:1},{id:605,cat:"Spiritual Growth",text:"You feel disconnected from your purpose. How do you realign yourself?",score:4},{id:606,cat:"Spiritual Growth",text:"You seek spiritual growth, but life keeps pulling you into distractions.",score:2},{id:607,cat:"Spiritual Growth",text:"You\u2019re unsure if you\u2019re progressing on the spiritual path. How do you evaluate growth?",score:2},{id:608,cat:"Spiritual Growth",text:"You wish to surrender but feel fear of losing control. What helps you let go?",score:5},{id:609,cat:"Spiritual Growth",text:"You\u2019re drawn to multiple spiritual paths. How do you find clarity?",score:3},{id:610,cat:"Spiritual Growth",text:"You long for inner silence but your mind is always noisy. What practice helps?",score:3},{id:611,cat:"Spiritual Growth",text:"Your ego gets in the way of devotion. How do you stay humble?",score:4},{id:612,cat:"Spiritual Growth",text:"You\u2019re confused between spiritual bypassing and true peace. How do you differentiate?",score:5},{id:613,cat:"Spiritual Growth",text:"You\u2019re constantly seeking new spiritual experiences. How do you find contentment?",score:2},{id:614,cat:"Spiritual Growth",text:"You fear judgment for following your spiritual path. What gives you courage?",score:1},{id:615,cat:"Spiritual Growth",text:"You want to make your whole life spiritual, not just your practices. Where do you begin?",score:4},{id:701,cat:"Family & Parenting",text:"Your child refuses to follow your guidance. How do you respond patiently?",score:3},{id:702,cat:"Family & Parenting",text:"You\u2019re juggling parenting and your own self-care. How do you balance both with love?",score:2},{id:703,cat:"Family & Parenting",text:"Your teen is making choices you disagree with. How do you stay connected without control?",score:5},{id:704,cat:"Family & Parenting",text:"You often lose your temper with your kids. What wisdom helps you cultivate calmness?",score:1},{id:705,cat:"Family & Parenting",text:"You and your partner disagree on parenting approaches. What helps you align?",score:3},{id:706,cat:"Family & Parenting",text:"Your aging parents need support, but you feel overwhelmed. How do you stay loving?",score:4},{id:707,cat:"Family & Parenting",text:"You feel unappreciated as a caregiver. How do you find meaning in your role?",score:2},{id:708,cat:"Family & Parenting",text:"Your family mocks your spiritual beliefs. What helps you stay centered?",score:3},{id:709,cat:"Family & Parenting",text:"You\u2019re constantly comparing yourself to other parents. How do you stay grounded?",score:1},{id:710,cat:"Family & Parenting",text:"You want to teach values to your kids without being preachy. What\u2019s the wise approach?",score:4},{id:711,cat:"Family & Parenting",text:"You missed an important moment in your child\u2019s life due to work. How do you reconnect?",score:2},{id:712,cat:"Family & Parenting",text:"Your partner and you are drifting apart while raising children. How do you restore connection?",score:3},{id:713,cat:"Family & Parenting",text:"You carry guilt for past parenting mistakes. How do you forgive yourself and grow?",score:4},{id:714,cat:"Family & Parenting",text:"Your child faces failure and is devastated. How do you guide them?",score:3},{id:715,cat:"Family & Parenting",text:"You\u2019re struggling to discipline without being harsh. What wisdom brings compassion?",score:4},{id:801,cat:"Mind & Emotions",text:"You\u2019re overwhelmed by negative thoughts. How do you find peace of mind?",score:3},{id:802,cat:"Mind & Emotions",text:"You struggle to manage anger in tough situations. What practice helps you?",score:4},{id:803,cat:"Mind & Emotions",text:"You keep comparing yourself to others. How do you develop self-acceptance?",score:3},{id:804,cat:"Mind & Emotions",text:"You\u2019re caught in a loop of worry. How do you break free from overthinking?",score:4},{id:805,cat:"Mind & Emotions",text:"You feel emotionally numb. How do you reconnect with your feelings?",score:2},{id:806,cat:"Mind & Emotions",text:"You\u2019re dealing with intense grief. What helps you process and heal?",score:5},{id:807,cat:"Mind & Emotions",text:"You\u2019re unable to forgive someone. What softens your heart?",score:4},{id:808,cat:"Mind & Emotions",text:"You feel stuck in regret. What wisdom frees you?",score:3},{id:809,cat:"Mind & Emotions",text:"You often react impulsively. What helps you respond mindfully instead?",score:1},{id:810,cat:"Mind & Emotions",text:"You crave external validation. How do you build inner confidence?",score:2},{id:811,cat:"Mind & Emotions",text:"You\u2019re consumed by guilt. What helps you transform it?",score:3},{id:812,cat:"Mind & Emotions",text:"You\u2019re ashamed of a part of yourself. What helps you embrace it?",score:3},{id:813,cat:"Mind & Emotions",text:"You want to be more emotionally present. What guides this intention?",score:3},{id:814,cat:"Mind & Emotions",text:"You\u2019re constantly rushing. What helps you slow down and be present?",score:1},{id:815,cat:"Mind & Emotions",text:"You feel lost and unsure what you really want. What brings clarity?",score:2},{id:901,cat:"Social Responsibility",text:"You see someone in need but you\u2019re short on time. What guides your action?",score:3},{id:902,cat:"Social Responsibility",text:"You want to help but doubt your small action matters. What motivates you?",score:1},{id:903,cat:"Social Responsibility",text:"You see corruption or injustice in your community. How do you respond wisely?",score:5},{id:904,cat:"Social Responsibility",text:"You\u2019re tempted to ignore a problem that doesn\u2019t affect you directly.",score:2},{id:905,cat:"Social Responsibility",text:"You want to speak up for a cause but fear backlash. What helps you act?",score:4},{id:906,cat:"Social Responsibility",text:"You see someone being excluded. How do you promote inclusiveness?",score:2},{id:907,cat:"Social Responsibility",text:"You\u2019re overwhelmed by the suffering in the world. How do you stay hopeful?",score:4},{id:908,cat:"Social Responsibility",text:"You want to contribute more to society but don\u2019t know where to start.",score:1},{id:909,cat:"Social Responsibility",text:"You\u2019re unsure whether to support a controversial cause. What wisdom helps?",score:4},{id:910,cat:"Social Responsibility",text:"You\u2019re pressured to remain neutral on an issue you care about.",score:4},{id:911,cat:"Social Responsibility",text:"You wish to live sustainably but convenience pulls you otherwise.",score:2},{id:912,cat:"Social Responsibility",text:"You see someone being mistreated online. What wisdom guides your reaction?",score:3},{id:913,cat:"Social Responsibility",text:"You feel cynical about positive change. How do you restore belief in action?",score:3},{id:914,cat:"Social Responsibility",text:"Your privilege gives you advantages. How do you use it responsibly?",score:4},{id:915,cat:"Social Responsibility",text:"You want to serve without ego or superiority. What cultivates humility?",score:5}];
const WISDOM=[{id:1,verse:"2.47",text:"You have the right to perform your prescribed duty, but you are not entitled to the fruits of action."},{id:2,verse:"2.5",text:"A person who is devoted to the path of selfless action attains perfection."},{id:3,verse:"2.56",text:"One who is not disturbed by happiness and distress and is steady in both is certainly eligible for liberation."},{id:4,verse:"2.7",text:"A person who is not disturbed by the incessant flow of desires can achieve peace."},{id:5,verse:"2.71",text:"One who has given up all desires for sense gratification lives free from longing, without ego."},{id:6,verse:"3.7",text:"One who controls the mind and engages the active senses in work without attachment is superior."},{id:7,verse:"3.19",text:"Therefore, always perform your duty without attachment, for by doing so one attains the Supreme."},{id:8,verse:"3.27",text:"Actions are performed by the modes of nature, but one deluded by ego thinks, \u201CI am the doer.\u201D"},{id:9,verse:"3.3",text:"Surrender all your actions to Me, with mind focused on the Self, free from longing and selfishness."},{id:10,verse:"4.18",text:"One who sees inaction in action, and action in inaction, is truly wise."},{id:11,verse:"4.2",text:"Abandoning all attachment to the results of action, one is ever content and not dependent."},{id:12,verse:"4.23",text:"One who acts without attachment, dedicating actions to the Divine, is untouched by sin."},{id:13,verse:"4.33",text:"Knowledge is better than mechanical sacrifice; spiritual wisdom leads to liberation."},{id:14,verse:"4.38",text:"There is no purifier in this world equal to knowledge."},{id:15,verse:"5.18",text:"The wise see with equal vision a Brahmana, a cow, an elephant, a dog, and a dog-eater."},{id:16,verse:"5.2",text:"One who is not attached to external things and is joyful within, never wavers in happiness or distress."},{id:17,verse:"6.5",text:"One must elevate oneself by one\u2019s own mind, not degrade oneself. The mind is friend and enemy."},{id:18,verse:"6.6",text:"For one who has conquered the mind, it is the best of friends; but for one who has failed, it is the worst enemy."},{id:19,verse:"6.7",text:"The serene person, who is not affected by dualities, is dear to the Divine."},{id:20,verse:"6.9",text:"One who is equal to friends and enemies, neutral among relatives and strangers, is very dear to Me."},{id:21,verse:"6.1",text:"A yogi should always try to concentrate the mind, living in solitude, with controlled body and mind."},{id:22,verse:"6.16",text:"There is no possibility of becoming a yogi if one eats too much or too little, sleeps too much or too little."},{id:23,verse:"6.17",text:"He who is temperate in eating, recreation, sleep, and work can mitigate all material pains."},{id:24,verse:"6.19",text:"As a lamp in a windless place does not waver, so is the yogi whose mind is controlled."},{id:25,verse:"6.2",text:"When the mind is restrained by the practice of yoga, one sees the Self by the self."},{id:26,verse:"7.16",text:"Four kinds of people begin devotional service: the distressed, the seeker of knowledge, the seeker of wealth, and the wise."},{id:27,verse:"9.22",text:"To those who are constantly devoted, I carry what they lack and preserve what they have."},{id:28,verse:"9.26",text:"If one offers Me with love a leaf, a flower, fruit, or water, I accept it."},{id:29,verse:"10.2",text:"I am the Self, O Gudakesha, seated in the hearts of all creatures."},{id:30,verse:"12.13-14",text:"One who is not envious, friendly and compassionate, free from ego, is dear to Me."},{id:31,verse:"12.15",text:"By whom the world is not agitated and who cannot be agitated by the world, such a person is dear to Me."},{id:32,verse:"12.16",text:"One who is content, pure, indifferent, untroubled, and who renounces all undertakings, is dear to Me."},{id:33,verse:"12.19",text:"One who is equal in honor and dishonor, silence and speech, content with anything, is dear to Me."},{id:34,verse:"13.8-12",text:"Humility, nonviolence, patience, cleanliness, steadiness, self-control \u2014 this is knowledge."},{id:35,verse:"14.22-25",text:"One who does not hate illumination, attachment, or delusion, nor longs for them when absent, is wise."},{id:36,verse:"15.5",text:"The wise give up pride, delusion, attachment, ego, and selfish desires and attain perfection."},{id:37,verse:"16.2-3",text:"Nonviolence, truthfulness, absence of anger, renunciation, peacefulness, compassion \u2014 these are divine qualities."},{id:38,verse:"16.11-12",text:"Possessed with endless desires and bound by anxiety, such people are demonic in nature."},{id:39,verse:"17.15",text:"Speech that does not offend, is truthful, pleasant, and beneficial, is the austerity of speech."},{id:40,verse:"18.66",text:"Abandon all varieties of dharma and surrender unto Me alone. I shall deliver you from all sin."},{id:41,verse:"2.14",text:"The contact of the senses with their objects gives rise to pleasure and pain; they come and go."},{id:42,verse:"2.38",text:"Treat alike pleasure and pain, gain and loss, victory and defeat. Engage in your duty."},{id:43,verse:"2.62",text:"Dwelling on sense objects develops attachment, which leads to desire, then anger, delusion, and ruin."},{id:44,verse:"2.64",text:"One who acts with self-control, free from attachment and aversion, attains peace."},{id:45,verse:"3.16",text:"One who does not follow the cycle of sacrifice set in motion by the Divine lives in vain."},{id:46,verse:"4.7",text:"Whenever there is a decline in righteousness, I manifest Myself."},{id:47,verse:"5.29",text:"I am the benefactor of all beings, the friend of all living entities, and the object of all sacrifices."},{id:48,verse:"6.26",text:"Whenever the mind wanders, bring it back under control of the Self."},{id:49,verse:"6.32",text:"One who sees all beings as equal to oneself is the highest yogi."},{id:50,verse:"8.5",text:"Whoever at the time of death remembers Me alone attains My nature."},{id:51,verse:"9.4",text:"All beings are in Me, but I am not in them."},{id:52,verse:"9.29",text:"I am impartial to all beings. But those who worship Me with love are in Me, and I am in them."},{id:53,verse:"10.8",text:"I am the source of all spiritual and material worlds. The wise worship Me with devotion."},{id:54,verse:"11.33",text:"Rise and attain fame. Conquer your enemies and enjoy a flourishing kingdom."},{id:55,verse:"13.27",text:"Wherever there is life, there is the Supreme Spirit."},{id:56,verse:"14.6",text:"The mode of goodness is pure, illuminating, and free from sickness."},{id:57,verse:"14.24",text:"One who is undisturbed by the modes of nature remains poised and steady."},{id:58,verse:"15.1",text:"The ignorant cannot perceive the soul departing or residing in the body; the wise can see clearly."},{id:59,verse:"16.1",text:"Fearlessness, purity of heart, self-control, and knowledge are divine qualities."},{id:60,verse:"18.11",text:"One who has renounced the fruits of action is truly renounced, not one who merely gives up work."},{id:61,verse:"18.14",text:"The five factors of action are: body, performer, senses, effort, and Divine will."},{id:62,verse:"18.26",text:"A performer who is detached, not egoistic, and resolute is said to be in the mode of goodness."},{id:63,verse:"18.33",text:"Unbreakable determination, sustained with single-minded devotion, is born of the mode of goodness."},{id:64,verse:"18.35",text:"Determination which holds fast through dreams, fear, grief, and delusion is of the mode of ignorance."},{id:65,verse:"18.37",text:"That which in the beginning is like poison but at the end is like nectar is happiness in goodness."},{id:66,verse:"18.63",text:"Thus I have explained to you this wisdom. Reflect on it fully and then act as you choose."},{id:67,verse:"18.78",text:"Wherever there is Krishna, the master of yoga, and Arjuna, there is victory, wealth, and righteousness."},{id:68,verse:"12.17",text:"One who neither rejoices nor hates, who neither laments nor desires, is dear to Me."},{id:69,verse:"12.2",text:"Those who follow this immortal dharma with faith and devotion are exceedingly dear to Me."},{id:70,verse:"5.7",text:"One who is devoted to the path of selfless action is pure in heart and remains unaffected by action."},{id:71,verse:"6.1",text:"One who performs duties without seeking results is a true renunciate and yogi."},{id:72,verse:"2.63",text:"From anger arises delusion; from delusion, bewilderment of memory; from that, loss of intelligence."},{id:73,verse:"13.26",text:"Know that whatever is born \u2014 moving or unmoving \u2014 is born through the union of field and knower."},{id:74,verse:"10.4-5",text:"Intelligence, knowledge, forgiveness, truthfulness, self-control \u2014 these come from Me alone."},{id:75,verse:"7.7",text:"There is nothing higher than Me. Everything rests on Me like pearls strung on a thread."},{id:76,verse:"4.7-8",text:"I appear millennium after millennium to protect the good and destroy the wicked."},{id:77,verse:"13.13",text:"I shall now explain what is to be known \u2014 knowing which one attains immortality."},{id:78,verse:"6.28",text:"A disciplined yogi enjoys unending happiness and is free from all sins."},{id:79,verse:"11.12",text:"If a thousand suns were to rise at once, the radiance might resemble the Supreme Being."},{id:80,verse:"15.1",text:"The self-realized see the soul clearly as it leaves, stays, or enjoys the body."}];

// ─── CONFIG ───
const CC={
  "Personal Dilemmas":{c:"#3B82F6",bg:"#DBEAFE",i:"\u25EF",p:"circles"},
  "Professional Challenges":{c:"#10B981",bg:"#D1FAE5",i:"\u25A6",p:"grid"},
  "Moral/Ethical Decisions":{c:"#EF4444",bg:"#FEE2E2",i:"\u25B3",p:"triangles"},
  "Relationship Situations":{c:"#F59E0B",bg:"#FEF3C7",i:"\u25C7",p:"diamonds"},
  "Mind & Emotions":{c:"#8B5CF6",bg:"#EDE9FE",i:"\u2248",p:"waves"},
  "Spiritual Growth":{c:"#14B8A6",bg:"#CCFBF1",i:"\u2726",p:"lotus"},
  "Wealth & Simplicity":{c:"#D97706",bg:"#FEF3C7",i:"\u2B21",p:"hex"},
  "Family & Parenting":{c:"#EC4899",bg:"#FCE7F3",i:"\u2665",p:"hearts"},
  "Social Responsibility":{c:"#6366F1",bg:"#E0E7FF",i:"\u2605",p:"stars"},
};
const CATS=Object.keys(CC);
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

// ─── STORAGE HELPERS ───
const loadHistory=()=>{try{return JSON.parse(localStorage.getItem("guru_history")||"[]")}catch{return[]}};
const saveHistory=h=>{try{localStorage.setItem("guru_history",JSON.stringify(h.slice(-20)))}catch{}};
const hasSeenRules=()=>{try{return localStorage.getItem("guru_rules_seen")==="1"}catch{return false}};
const markRulesSeen=()=>{try{localStorage.setItem("guru_rules_seen","1")}catch{}};

// ─── SVG PATTERNS ───
function GP({p,c,s=100,o=0.08}){
  const P={
    circles:<>{[0,1,2].map(i=>[0,1,2].map(j=><circle key={`${i}${j}`} cx={20+i*40} cy={20+j*40} r={12-i*2} fill="none" stroke={c} strokeWidth="1.5"/>))}</>,
    grid:<>{[0,1,2,3].map(i=><g key={i}><line x1="0" y1={i*30+15} x2="120" y2={i*30+15} stroke={c} strokeWidth="1"/><line x1={i*30+15} y1="0" x2={i*30+15} y2="120" stroke={c} strokeWidth="1"/></g>)}</>,
    triangles:<>{[[30,10,10,50,50,50],[70,10,50,50,90,50],[50,60,30,100,70,100]].map((q,i)=><polygon key={i} points={q.join(",")} fill="none" stroke={c} strokeWidth="1.5"/>)}</>,
    diamonds:<>{[[40,10,70,40,40,70,10,40],[80,30,110,60,80,90,50,60]].map((q,i)=><polygon key={i} points={q.join(",")} fill="none" stroke={c} strokeWidth="1.5"/>)}</>,
    waves:<>{[20,50,80].map(y=><path key={y} d={`M0,${y} Q30,${y-15} 60,${y} T120,${y}`} fill="none" stroke={c} strokeWidth="1.5"/>)}</>,
    lotus:<>{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="60" cy="60" rx="20" ry="40" fill="none" stroke={c} strokeWidth="1" transform={`rotate(${a},60,60)`}/>)}</>,
    hex:<>{[[40,15],[80,15],[40,65]].map(([x,y],i)=><polygon key={i} points={`${x},${y} ${x+20},${y-12} ${x+40},${y} ${x+40},${y+24} ${x+20},${y+36} ${x},${y+24}`} fill="none" stroke={c} strokeWidth="1.5"/>)}</>,
    hearts:<path d="M60,90 C60,90 20,60 20,35 C20,15 40,10 60,30 C80,10 100,15 100,35 C100,60 60,90 60,90Z" fill="none" stroke={c} strokeWidth="1.5"/>,
    stars:<>{[[35,30,12],[85,70,10],[55,100,8]].map(([cx,cy,r],i)=>{const pts=Array.from({length:10},(_,k)=>{const a=Math.PI/2+k*Math.PI/5;const R=k%2?r*.4:r;return`${cx+R*Math.cos(a)},${cy-R*Math.sin(a)}`}).join(" ");return<polygon key={i} points={pts} fill="none" stroke={c} strokeWidth="1.2"/>})}</>,
  };
  return<svg width={s} height={s} viewBox="0 0 120 120" style={{opacity:o,position:"absolute",right:8,top:8}}>{P[p]||P.circles}</svg>
}
function WP({s=50}){
  return<svg width={s} height={s} viewBox="0 0 60 60" style={{opacity:.12,position:"absolute",left:8,top:"50%",transform:"translateY(-50%)"}}>
    {[0,45,90,135].map(a=><ellipse key={a} cx="30" cy="30" rx="10" ry="25" fill="none" stroke="#B8860B" strokeWidth="1" transform={`rotate(${a},30,30)`}/>)}
    <circle cx="30" cy="30" r="6" fill="none" stroke="#B8860B" strokeWidth="1.5"/>
  </svg>
}
function Mandala({s=80}){
  return<svg width={s} height={s} viewBox="0 0 80 80" className="mx-auto mb-4">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=><ellipse key={a} cx="40" cy="40" rx="8" ry="30" fill="none" stroke="#F59E0B" strokeWidth="1" opacity=".6" transform={`rotate(${a},40,40)`}/>)}
    <circle cx="40" cy="40" r="12" fill="none" stroke="#F59E0B" strokeWidth="2"/><circle cx="40" cy="40" r="4" fill="#F59E0B"/>
  </svg>
}

const BG="linear-gradient(180deg,#1B1B2F,#162447)";
const BG2="linear-gradient(135deg,#1B1B2F 0%,#162447 50%,#1F4068 100%)";
const BTN="linear-gradient(135deg,#F59E0B,#D97706)";
const Btn=({children,onClick,disabled,className=""})=><button onClick={onClick} disabled={disabled} className={`w-full py-4 rounded-xl text-lg font-semibold text-slate-900 disabled:opacity-30 active:scale-[0.98] transition-transform ${className}`} style={{background:disabled?"#555":BTN}}>{children}</button>;

// ─── RULES SCREEN ───
function Rules({onDone}){
  const [pg,setPg]=useState(0);
  const pages=[
    {title:"Welcome",body:<div className="space-y-4">
      <p className="text-slate-300 text-sm leading-relaxed">The Guru is a card game where ancient wisdom meets modern life. Players take turns as <span className="text-amber-400 font-semibold">Seekers</span> presenting real-world dilemmas. The other players \u2014 the <span className="text-amber-400 font-semibold">Wise Gurus</span> \u2014 respond using wisdom cards from the Bhagavad Gita.</p>
      <p className="text-slate-300 text-sm leading-relaxed">No prior knowledge of the Gita is needed. Just a willingness to think, listen, and have fun with family and friends.</p>
      <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-slate-800/40"><span className="text-2xl">3\u20138</span><span className="text-slate-400 text-sm">Players</span><span className="text-2xl ml-4">20\u2019</span><span className="text-slate-400 text-sm">Average game</span></div>
    </div>},
    {title:"How It Works",body:<div className="space-y-3">
      {[
        ["1","The Seeker draws a scenario card and reads it aloud to the group."],
        ["2","Phone is passed to each Guru privately. They pick one wisdom card from their hand of 5."],
        ["3","All picks are revealed. Each Guru verbally explains how their chosen wisdom solves the dilemma."],
        ["4","The Seeker awards the round to the Guru with the most insightful response."],
      ].map(([n,t])=><div key={n} className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">{n}</div>
        <p className="text-slate-300 text-sm leading-relaxed">{t}</p>
      </div>)}
    </div>},
    {title:"Scoring",body:<div className="space-y-4">
      <div className="p-3 rounded-lg bg-slate-800/40">
        <p className="text-amber-400 text-sm font-semibold mb-1">Simple Mode</p>
        <p className="text-slate-300 text-sm">Each scenario won = 1 point. Most points wins.</p>
      </div>
      <div className="p-3 rounded-lg bg-slate-800/40">
        <p className="text-amber-400 text-sm font-semibold mb-1">Advanced Mode (Scored)</p>
        <p className="text-slate-300 text-sm">Each scenario has a difficulty score (1\u20135 points). Harder dilemmas are worth more. Total points wins.</p>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-2">
        {[{s:1,l:"Easy",c:"#6EE7B7"},{s:2,l:"Simple",c:"#A7F3D0"},{s:3,l:"Medium",c:"#FCD34D"},{s:4,l:"Hard",c:"#FCA5A5"},{s:5,l:"Deep",c:"#F87171"}].map(x=>
          <div key={x.s} className="text-center p-2 rounded-lg" style={{background:x.c+"20"}}>
            <div className="text-lg font-bold" style={{color:x.c}}>{x.s}</div>
            <div className="text-xs text-slate-400">{x.l}</div>
          </div>
        )}
      </div>
    </div>},
    {title:"Tips",body:<div className="space-y-3">
      {[
        "\u2728 There\u2019s no \u201Ccorrect\u201D answer. The Seeker picks whoever resonates most with them.",
        "\uD83D\uDD04 Wisdom cards get recycled when the deck runs out, so the same verse can appear in new contexts.",
        "\uD83C\uDFAD Try the \u201CAnonymous\u201D variant: Gurus submit cards face-down so the Seeker doesn\u2019t know who played what.",
        "\u23F1\uFE0F For faster games, set a 30-second limit for Guru explanations.",
        "\uD83D\uDCA1 The game is most fun when Gurus get creative with how they connect the wisdom to the scenario.",
      ].map((t,i)=><p key={i} className="text-slate-300 text-sm leading-relaxed">{t}</p>)}
    </div>},
  ];
  return(
    <div className="min-h-screen p-5 flex flex-col" style={{background:BG}}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-400" style={{fontFamily:"Georgia,serif"}}>{pages[pg].title}</h2>
        <div className="flex gap-1">{pages.map((_,i)=><div key={i} className={`w-2 h-2 rounded-full ${i===pg?"bg-amber-400":"bg-slate-700"}`}/>)}</div>
      </div>
      <div className="flex-1">{pages[pg].body}</div>
      <div className="flex gap-3 mt-6">
        {pg>0&&<button onClick={()=>setPg(pg-1)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400">Back</button>}
        {pg<pages.length-1?<button onClick={()=>setPg(pg+1)} className="flex-1 py-4 rounded-xl text-lg font-semibold text-slate-900" style={{background:BTN}}>Next</button>
        :<button onClick={()=>{markRulesSeen();onDone()}} className="flex-1 py-4 rounded-xl text-lg font-semibold text-slate-900" style={{background:BTN}}>Got it, let's play!</button>}
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function App(){
  const [screen,setScreen]=useState(()=>hasSeenRules()?"home":"rules");
  const [players,setPlayers]=useState([]);
  const [names,setNames]=useState(["","",""]);
  const [mode,setMode]=useState("simple");
  const [cats,setCats]=useState(new Set(CATS.slice(0,6)));
  const [rounds,setRounds]=useState(0);
  const [history,setHistory]=useState(()=>loadHistory());

  // Game
  const [skIdx,setSkIdx]=useState(0);
  const [rNum,setRNum]=useState(0);
  const [sDeck,setSDeck]=useState([]);
  const [wDeck,setWDeck]=useState([]);
  const [wDis,setWDis]=useState([]);
  const [hands,setHands]=useState([]);
  const [curS,setCurS]=useState(null);
  const [sels,setSels]=useState({});
  const [phase,setPhase]=useState("roundStart");
  const [gIdx,setGIdx]=useState(0);
  const [rIdx,setRIdx]=useState(0);
  const [winner,setWinner]=useState(null);
  const [gameStats,setGameStats]=useState({roundsPlayed:0,catsUsed:[]});
  const gOrder=useRef([]);

  const getGurus=(si,n)=>{const g=[];for(let i=1;i<n;i++)g.push((si+i)%n);return g};
  const draw=(dk,dis,n)=>{let d=[...dk],di=[...dis];const r=[];for(let i=0;i<n;i++){if(!d.length){d=shuffle(di);di=[]}if(d.length)r.push(d.pop())}return{drawn:r,deck:d,discard:di}};

  const startGame=()=>{
    const fs=shuffle(SCENARIOS.filter(s=>cats.has(s.cat)));
    const sw=shuffle([...WISDOM]);
    const rd=rounds||players.length*2;
    let wd=[...sw],wdi=[];
    const h=players.map(()=>{const r=draw(wd,wdi,5);wd=r.deck;wdi=r.discard;return r.drawn});
    setSDeck(fs);setWDeck(wd);setWDis(wdi);setHands(h);setSkIdx(0);setRNum(1);setSels({});
    setPhase("roundStart");setCurS(fs[0]);setScreen("game");
    gOrder.current=getGurus(0,players.length);setGIdx(0);
    setGameStats({roundsPlayed:0,catsUsed:[...cats]});
  };

  const startRound=(rn,si)=>{gOrder.current=getGurus(si,players.length);setGIdx(0);setSels({});setRIdx(0);setWinner(null);setCurS(sDeck[rn-1]);setPhase("roundStart")};

  const selectCard=ci=>{
    const gpi=gOrder.current[gIdx];const card=hands[gpi][ci];
    setHands(h=>h.map((hand,i)=>i===gpi?hand.filter((_,j)=>j!==ci):hand));
    setWDis(p=>[...p,card]);setSels(p=>({...p,[gpi]:card}));
    if(gIdx<gOrder.current.length-1){setGIdx(p=>p+1);setPhase("passing")}
    else{setRIdx(0);setPhase("reflect")}
  };

  const pickWinner=gpi=>{
    const pts=mode==="advanced"?curS.score:1;
    setPlayers(p=>p.map((pl,i)=>i===gpi?{...pl,score:pl.score+pts,wins:pl.wins+1}:pl));
    setWinner(gpi);setPhase("scoreUpdate");
    setGameStats(s=>({...s,roundsPlayed:s.roundsPlayed+1}));
  };

  const nextRound=()=>{
    let wd=[...wDeck],wdi=[...wDis];
    const nh=hands.map(h=>{const need=5-h.length;if(need<=0)return h;const r=draw(wd,wdi,need);wd=r.deck;wdi=r.discard;return[...h,...r.drawn]});
    setHands(nh);setWDeck(wd);setWDis(wdi);
    const mr=rounds||players.length*2;
    if(rNum>=mr||rNum>=sDeck.length){
      const entry={date:new Date().toLocaleDateString(),mode,rounds:rNum,players:players.map(p=>({name:p.name,score:p.score,wins:p.wins})),winner:players.reduce((a,b)=>a.score>b.score?a:b).name};
      const nh=[...history,entry];setHistory(nh);saveHistory(nh);
      setScreen("gameover");return;
    }
    const ns=(skIdx+1)%players.length;setSkIdx(ns);setRNum(p=>p+1);startRound(rNum+1,ns);
  };

  // ─── RULES ───
  if(screen==="rules")return<Rules onDone={()=>setScreen("home")}/>;

  // ─── HOME ───
  if(screen==="home"){
    return(
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:BG2}}>
        <Mandala/>
        <h1 className="text-4xl font-bold text-amber-400 mb-1" style={{fontFamily:"Georgia,serif"}}>THE GURU</h1>
        <p className="text-amber-200/60 text-sm tracking-widest mb-8">WISDOM SEEKERS</p>
        <p className="text-slate-300/80 text-center text-sm mb-8 max-w-xs">Ancient wisdom meets modern dilemmas. Play with family and friends.</p>
        <Btn onClick={()=>setScreen("setup")}>New Game</Btn>
        <div className="flex gap-4 mt-5">
          <button onClick={()=>setScreen("rules")} className="text-slate-400 text-sm underline underline-offset-2">How to Play</button>
          {history.length>0&&<button onClick={()=>setScreen("history")} className="text-slate-400 text-sm underline underline-offset-2">Past Games ({history.length})</button>}
        </div>
        <p className="text-slate-600 text-xs mt-6">3\u20138 Players</p>
      </div>
    );
  }

  // ─── HISTORY ───
  if(screen==="history"){
    return(
      <div className="min-h-screen p-5" style={{background:BG}}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-amber-400" style={{fontFamily:"Georgia,serif"}}>Past Games</h2>
          <button onClick={()=>setScreen("home")} className="text-slate-400 text-sm">\u2715 Close</button>
        </div>
        {history.length===0?<p className="text-slate-500 text-sm">No games yet.</p>:
        <div className="space-y-3">{[...history].reverse().map((g,i)=>(
          <div key={i} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-amber-400 text-sm font-semibold">{g.winner} won!</span>
              <span className="text-slate-500 text-xs">{g.date}</span>
            </div>
            <div className="flex gap-1 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">{g.mode}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">{g.rounds} rounds</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.players.sort((a,b)=>b.score-a.score).map((p,j)=>(
                <span key={j} className={`text-xs px-2 py-1 rounded ${j===0?"bg-amber-500/20 text-amber-400":"bg-slate-800 text-slate-500"}`}>
                  {p.name}: {p.score}pts ({p.wins}w)
                </span>
              ))}
            </div>
          </div>
        ))}</div>}
      </div>
    );
  }

  // ─── SETUP ───
  if(screen==="setup"){
    const add=()=>{if(names.length<8)setNames([...names,""])};
    const rm=i=>{if(names.length>3)setNames(names.filter((_,j)=>j!==i))};
    const ok=names.filter(n=>n.trim()).length>=3;
    return(
      <div className="min-h-screen p-5" style={{background:BG}}>
        <button onClick={()=>setScreen("home")} className="text-slate-500 text-sm mb-3">\u2190 Back</button>
        <h2 className="text-2xl font-bold text-amber-400 mb-1" style={{fontFamily:"Georgia,serif"}}>Players</h2>
        <p className="text-slate-400 text-sm mb-5">Add 3\u20138 player names</p>
        <div className="space-y-3 mb-4">{names.map((n,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="text-amber-500/60 text-sm w-6">{i+1}.</span>
            <input type="text" value={n} placeholder={`Player ${i+1}`} onChange={e=>{const x=[...names];x[i]=e.target.value;setNames(x)}}
              className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-base outline-none focus:border-amber-500"/>
            {names.length>3&&<button onClick={()=>rm(i)} className="text-slate-500 text-xl px-2">\u00D7</button>}
          </div>
        ))}</div>
        {names.length<8&&<button onClick={add} className="w-full py-3 rounded-lg border border-dashed border-slate-600 text-slate-400 mb-5">+ Add Player</button>}
        <Btn disabled={!ok} onClick={()=>{
          setPlayers(names.filter(n=>n.trim()).map(n=>({name:n.trim(),score:0,wins:0})));
          setRounds(names.filter(n=>n.trim()).length*2);setScreen("settings");
        }}>Next</Btn>
      </div>
    );
  }

  // ─── SETTINGS ───
  if(screen==="settings"){
    const tog=c=>{const s=new Set(cats);if(s.has(c)){if(s.size>3)s.delete(c)}else s.add(c);setCats(s)};
    const scenarioCount=SCENARIOS.filter(s=>cats.has(s.cat)).length;
    return(
      <div className="min-h-screen p-5" style={{background:BG}}>
        <button onClick={()=>setScreen("setup")} className="text-slate-500 text-sm mb-3">\u2190 Back</button>
        <h2 className="text-2xl font-bold text-amber-400 mb-5" style={{fontFamily:"Georgia,serif"}}>Game Settings</h2>
        <p className="text-slate-300 text-sm font-semibold mb-2">Game Mode</p>
        <div className="flex gap-3 mb-5">{["simple","advanced"].map(m=>(
          <button key={m} onClick={()=>setMode(m)} className={`flex-1 py-3 rounded-lg text-sm font-semibold border ${mode===m?"border-amber-500 bg-amber-500/20 text-amber-400":"border-slate-700 text-slate-400"}`}>
            {m==="simple"?"Simple":"Advanced"}
          </button>
        ))}</div>
        <p className="text-slate-300 text-sm font-semibold mb-2">Rounds</p>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={()=>setRounds(Math.max(players.length,rounds-1))} className="w-12 h-12 rounded-lg bg-slate-800 text-white text-2xl">-</button>
          <div className="text-center">
            <span className="text-amber-400 text-3xl font-bold">{rounds}</span>
            <p className="text-slate-500 text-xs">rounds</p>
          </div>
          <button onClick={()=>setRounds(Math.min(Math.min(scenarioCount,30),rounds+1))} className="w-12 h-12 rounded-lg bg-slate-800 text-white text-2xl">+</button>
          <div className="ml-2 text-slate-500 text-xs leading-tight">
            <p>~{Math.round(rounds*2.5)} min estimated</p>
            <p>Each player seeks {Math.floor(rounds/players.length)}\u2013{Math.ceil(rounds/players.length)}x</p>
          </div>
        </div>
        <div className="flex gap-2 mb-5 mt-2">{[
          {l:"Quick",v:players.length},{l:"Standard",v:players.length*2},{l:"Long",v:players.length*3}
        ].map(x=><button key={x.l} onClick={()=>setRounds(Math.min(scenarioCount,x.v))} className={`px-3 py-1.5 rounded-full text-xs border ${rounds===x.v?"border-amber-500 text-amber-400 bg-amber-500/10":"border-slate-700 text-slate-500"}`}>{x.l} ({x.v})</button>)}</div>
        <p className="text-slate-300 text-sm font-semibold mb-2">Categories <span className="text-slate-500 font-normal">(pick 3+)</span></p>
        <div className="space-y-2 mb-5">{CATS.map(c=>{const cfg=CC[c];const sel=cats.has(c);
          return<button key={c} onClick={()=>tog(c)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${sel?"border-opacity-80":"border-slate-700 opacity-40"}`}
            style={sel?{borderColor:cfg.c,background:cfg.c+"15"}:{}}>
            <span className="text-lg">{cfg.i}</span>
            <span className={`text-sm font-medium ${sel?"text-white":"text-slate-500"}`}>{c}</span>
            {sel&&<span className="ml-auto text-xs" style={{color:cfg.c}}>{SCENARIOS.filter(s=>s.cat===c).length}</span>}
          </button>
        })}</div>
        <div className="text-center text-slate-500 text-xs mb-3">{scenarioCount} scenario cards available</div>
        <Btn onClick={startGame}>Start Game</Btn>
      </div>
    );
  }

  // ─── GAME ───
  if(screen==="game"){
    const seeker=players[skIdx];const mr=rounds||players.length*2;const cfg=curS?CC[curS.cat]:{};

    if(phase==="roundStart"){
      return(
        <div className="min-h-screen p-5 flex flex-col" style={{background:BG}}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-xs">Round {rNum}/{mr}</span>
            <span className="text-amber-400 text-xs font-semibold">{mode==="advanced"?"Advanced":"Simple"}</span>
          </div>
          <div className="text-center mb-5"><p className="text-slate-400 text-sm">The Seeker</p><p className="text-2xl font-bold text-white" style={{fontFamily:"Georgia,serif"}}>{seeker.name}</p></div>
          <div className="relative rounded-2xl p-6 mb-5 overflow-hidden" style={{background:cfg.bg,border:`2px solid ${cfg.c}40`}}>
            <GP p={cfg.p} c={cfg.c} o={0.1}/>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.i}</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{color:cfg.c}}>{curS.cat}</span>
                {mode==="advanced"&&<span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:cfg.c}}>{curS.score} pt{curS.score>1?"s":""}</span>}
              </div>
              <p className="text-lg leading-relaxed" style={{color:"#1a1a2e",fontFamily:"Georgia,serif"}}>"{curS.text}"</p>
            </div>
          </div>
          <p className="text-center text-amber-200/60 text-sm italic mb-5">"Oh wise gurus, I have come to you with my problem. Please give me a solution."</p>
          <div className="flex flex-wrap gap-2 mb-5 justify-center">{players.map((p,i)=>(
            <div key={i} className={`px-3 py-1.5 rounded-full text-xs ${i===skIdx?"bg-amber-500/20 text-amber-400 border border-amber-500/40":"bg-slate-800 text-slate-400"}`}>{p.name}: {p.score}</div>
          ))}</div>
          <div className="mt-auto"><Btn onClick={()=>setPhase("passing")}>Begin Guru Responses</Btn></div>
        </div>
      );
    }

    if(phase==="passing"){
      const gpi=gOrder.current[gIdx];const guru=players[gpi];
      return(
        <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{background:BG}}>
          <svg width="60" height="60" viewBox="0 0 60 60" className="mb-6 opacity-40">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,4"/>
            <circle cx="30" cy="30" r="15" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,3"/>
          </svg>
          <p className="text-slate-400 text-sm mb-2">Pass the phone to</p>
          <p className="text-3xl font-bold text-amber-400 mb-1" style={{fontFamily:"Georgia,serif"}}>{guru.name}</p>
          <p className="text-slate-500 text-xs mb-8">Guru {gIdx+1} of {gOrder.current.length}</p>
          <Btn onClick={()=>setPhase("guruTurn")} className="max-w-xs">I'm {guru.name}</Btn>
        </div>
      );
    }

    if(phase==="guruTurn"){
      const gpi=gOrder.current[gIdx];const guru=players[gpi];const hand=hands[gpi];
      return(
        <div className="min-h-screen p-5" style={{background:BG}}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-amber-400 text-sm font-semibold">{guru.name}'s Turn</span>
            <span className="text-slate-500 text-xs">Pick one wisdom card</span>
          </div>
          <div className="rounded-lg p-3 mb-4" style={{background:cfg.c+"15",border:`1px solid ${cfg.c}30`}}>
            <p className="text-xs" style={{color:cfg.c}}>{cfg.i} {curS.cat}</p>
            <p className="text-white text-sm mt-1">"{curS.text}"</p>
          </div>
          <div className="space-y-3">{hand.map((card,i)=>(
            <button key={card.id} onClick={()=>selectCard(i)} className="w-full text-left relative rounded-xl p-4 overflow-hidden border border-amber-800/30 active:scale-[0.98] transition-transform" style={{background:"linear-gradient(135deg,#2a2215,#1e1a0e)"}}>
              <WP s={50}/><div className="relative z-10 pl-10">
                <p className="text-amber-500 text-xs font-semibold mb-1">BG {card.verse}</p>
                <p className="text-amber-100 text-sm leading-relaxed">"{card.text}"</p>
              </div>
            </button>
          ))}</div>
        </div>
      );
    }

    if(phase==="reflect"){
      const rgi=gOrder.current[rIdx];const rg=players[rgi];const rc=sels[rgi];
      return(
        <div className="min-h-screen p-5 flex flex-col" style={{background:BG}}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-xs">Reflect & Share</span>
            <span className="text-slate-500 text-xs">{rIdx+1} of {gOrder.current.length}</span>
          </div>
          <div className="rounded-lg p-3 mb-4" style={{background:cfg.c+"15",border:`1px solid ${cfg.c}30`}}>
            <p className="text-white text-sm">"{curS.text}"</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm mb-2">Guru</p>
            <p className="text-2xl font-bold text-amber-400 mb-6" style={{fontFamily:"Georgia,serif"}}>{rg.name}</p>
            <div className="w-full relative rounded-2xl p-6 overflow-hidden border border-amber-700/40" style={{background:"linear-gradient(135deg,#2a2215,#1e1a0e)"}}>
              <WP s={70}/><div className="relative z-10 pl-12">
                <p className="text-amber-500 text-sm font-semibold mb-2">BG {rc.verse}</p>
                <p className="text-amber-100 text-lg leading-relaxed" style={{fontFamily:"Georgia,serif"}}>"{rc.text}"</p>
              </div>
            </div>
            <p className="text-amber-200/40 text-sm italic mt-6 text-center">{rg.name}, share how this wisdom solves the dilemma.</p>
          </div>
          <Btn onClick={()=>{if(rIdx<gOrder.current.length-1)setRIdx(p=>p+1);else setPhase("seekerPick")}} className="mt-4">
            {rIdx<gOrder.current.length-1?"Next Guru":"Seeker, Choose the Wisest"}
          </Btn>
        </div>
      );
    }

    if(phase==="seekerPick"){
      return(
        <div className="min-h-screen p-5" style={{background:BG}}>
          <div className="text-center mb-4">
            <p className="text-slate-400 text-sm">Seeker's Decision</p>
            <p className="text-xl font-bold text-amber-400" style={{fontFamily:"Georgia,serif"}}>{seeker.name}, pick the wisest</p>
          </div>
          <div className="rounded-lg p-3 mb-5" style={{background:cfg.c+"15",border:`1px solid ${cfg.c}30`}}>
            <p className="text-white text-sm">"{curS.text}"</p>
            {mode==="advanced"&&<p className="text-xs mt-1" style={{color:cfg.c}}>Worth {curS.score} point{curS.score>1?"s":""}</p>}
          </div>
          <div className="space-y-3">{gOrder.current.map(gi=>{const g=players[gi];const card=sels[gi];
            return<button key={gi} onClick={()=>pickWinner(gi)} className="w-full text-left relative rounded-xl p-4 overflow-hidden border border-slate-700 active:scale-[0.98] active:border-amber-500 transition-all" style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)"}}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">{g.name[0]}</div>
                <div className="flex-1 min-w-0"><p className="text-amber-400 text-sm font-semibold">{g.name}</p><p className="text-amber-600 text-xs mb-1">BG {card.verse}</p><p className="text-slate-300 text-sm leading-relaxed">"{card.text}"</p></div>
              </div>
            </button>
          })}</div>
        </div>
      );
    }

    if(phase==="scoreUpdate"){
      const wp=players[winner];const pts=mode==="advanced"?curS.score:1;
      return(
        <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{background:BG}}>
          <svg width="80" height="80" viewBox="0 0 80 80" className="mb-6">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=><ellipse key={a} cx="40" cy="40" rx="6" ry="25" fill="none" stroke="#F59E0B" strokeWidth=".8" opacity=".4" transform={`rotate(${a},40,40)`}/>)}
            <circle cx="40" cy="40" r="18" fill="#F59E0B" opacity=".15"/><text x="40" y="46" textAnchor="middle" fill="#F59E0B" fontSize="20" fontWeight="bold">+{pts}</text>
          </svg>
          <p className="text-slate-400 text-sm mb-2">Wisest Guru</p>
          <p className="text-3xl font-bold text-amber-400 mb-2" style={{fontFamily:"Georgia,serif"}}>{wp.name}</p>
          <p className="text-slate-400 text-sm mb-8">+{pts} point{pts>1?"s":""}</p>
          <div className="w-full max-w-xs space-y-2 mb-8">{[...players].sort((a,b)=>b.score-a.score).map((p,i)=>(
            <div key={p.name} className={`flex items-center justify-between px-4 py-2 rounded-lg ${p.name===wp.name?"bg-amber-500/20 border border-amber-500/40":"bg-slate-800/40"}`}>
              <span className={`text-sm ${p.name===wp.name?"text-amber-400 font-semibold":"text-slate-400"}`}>{p.name}</span>
              <span className="text-amber-400 font-bold">{p.score}</span>
            </div>
          ))}</div>
          <Btn onClick={nextRound} className="max-w-xs">{rNum>=(rounds||players.length*2)?"Final Results":"Next Round"}</Btn>
        </div>
      );
    }
  }

  // ─── GAME OVER ───
  if(screen==="gameover"){
    const sorted=[...players].sort((a,b)=>b.score-a.score);
    const champ=sorted[0];const totalPts=players.reduce((s,p)=>s+p.score,0);
    const medals=["\uD83E\uDD47","\uD83E\uDD48","\uD83E\uDD49"];
    return(
      <div className="min-h-screen p-6" style={{background:BG2}}>
        <div className="flex flex-col items-center pt-6 mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100" className="mb-4">
            {Array.from({length:24}).map((_,i)=><ellipse key={i} cx="50" cy="50" rx="6" ry="38" fill="none" stroke="#F59E0B" strokeWidth=".6" opacity=".3" transform={`rotate(${i*15},50,50)`}/>)}
            <circle cx="50" cy="50" r="22" fill="#F59E0B" opacity=".15"/><circle cx="50" cy="50" r="15" fill="#F59E0B" opacity=".1"/>
          </svg>
          <p className="text-slate-400 text-sm mb-1">The Ultimate</p>
          <p className="text-3xl font-bold text-amber-400 mb-1" style={{fontFamily:"Georgia,serif"}}>Wisdom Seeker</p>
          <p className="text-3xl font-bold text-white" style={{fontFamily:"Georgia,serif"}}>{champ.name}</p>
          <p className="text-amber-500 text-lg mt-1">{champ.score} points</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 mb-6">{sorted.map((p,i)=>{
          const pct=totalPts?Math.round(p.score/totalPts*100):0;
          return<div key={p.name} className={`rounded-xl p-4 ${i===0?"bg-amber-500/15 border border-amber-500/30":"bg-slate-800/40 border border-slate-700/30"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{medals[i]||`#${i+1}`}</span>
              <span className={`flex-1 font-semibold ${i===0?"text-amber-400":"text-slate-300"}`}>{p.name}</span>
              <span className="text-amber-400 font-bold text-lg">{p.score}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-slate-700/50 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:i===0?"#F59E0B":"#64748B"}}/>
              </div>
              <span className="text-slate-500 text-xs">{p.wins} win{p.wins!==1?"s":""}</span>
            </div>
          </div>
        })}</div>

        {/* Game stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            {v:gameStats.roundsPlayed,l:"Rounds"},
            {v:players.length,l:"Players"},
            {v:mode==="advanced"?"Scored":"Simple",l:"Mode"},
          ].map((s,i)=><div key={i} className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-amber-400 text-lg font-bold">{s.v}</div>
            <div className="text-slate-500 text-xs">{s.l}</div>
          </div>)}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Btn onClick={()=>{
            setPlayers(players.map(p=>({...p,score:0,wins:0})));
            setScreen("settings");
          }}>Rematch (Same Players)</Btn>
          <button onClick={()=>{setScreen("home");setPlayers([]);setNames(["","",""]);}} className="w-full py-3 rounded-xl border border-slate-700 text-slate-400">New Game</button>
        </div>
      </div>
    );
  }

  return null;
}