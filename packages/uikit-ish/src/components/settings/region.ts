// A region guessed from the time zone (see Settings' `region`): each IANA
// zone's region (ISO 3166-1), packed. Each line is an area and some of its
// zones, each zone's name followed by its region's two letters. Some old
// names browsers still report are included (e.g. Asia/Calcutta). No region
// for `Etc/*` and UTC.

const packed = [
  'Africa/AbidjanCI,AccraGH,Addis_AbabaET,AlgiersDZ,AsmaraER,AsmeraER',
  'Africa/BamakoML,BanguiCF,BanjulGM,BissauGW,BlantyreMW,BrazzavilleCG',
  'Africa/BujumburaBI,CairoEG,CasablancaMA,CeutaES,ConakryGN,DakarSN',
  'Africa/Dar_es_SalaamTZ,DjiboutiDJ,DoualaCM,El_AaiunEH,FreetownSL',
  'Africa/GaboroneBW,HarareZW,JohannesburgZA,JubaSS,KampalaUG',
  'Africa/KhartoumSD,KigaliRW,KinshasaCD,LagosNG,LibrevilleGA,LomeTG',
  'Africa/LuandaAO,LubumbashiCD,LusakaZM,MalaboGQ,MaputoMZ,MaseruLS',
  'Africa/MbabaneSZ,MogadishuSO,MonroviaLR,NairobiKE,NdjamenaTD',
  'Africa/NiameyNE,NouakchottMR,OuagadougouBF,Porto-NovoBJ,Sao_TomeST',
  'Africa/TripoliLY,TunisTN,WindhoekNA',
  'America/AdakUS,AnchorageUS,AnguillaAI,AntiguaAG,AraguainaBR',
  'America/Argentina/Buenos_AiresAR,Argentina/CatamarcaAR',
  'America/Argentina/CordobaAR,Argentina/JujuyAR,Argentina/La_RiojaAR',
  'America/Argentina/MendozaAR,Argentina/Rio_GallegosAR',
  'America/Argentina/SaltaAR,Argentina/San_JuanAR,Argentina/San_LuisAR',
  'America/Argentina/TucumanAR,Argentina/UshuaiaAR,ArubaAW,AsuncionPY',
  'America/AtikokanCA,BahiaBR,Bahia_BanderasMX,BarbadosBB,BelemBR',
  'America/BelizeBZ,Blanc-SablonCA,Boa_VistaBR,BogotaCO,BoiseUS',
  'America/Buenos_AiresAR,Cambridge_BayCA,Campo_GrandeBR,CancunMX',
  'America/CaracasVE,CayenneGF,CaymanKY,ChicagoUS,ChihuahuaMX',
  'America/Coral_HarbourCA,Costa_RicaCR,CrestonCA,CuiabaBR,CuracaoCW',
  'America/DanmarkshavnGL,DawsonCA,Dawson_CreekCA,DenverUS,DetroitUS',
  'America/DominicaDM,EdmontonCA,EirunepeBR,El_SalvadorSV,Fort_NelsonCA',
  'America/FortalezaBR,Glace_BayCA,GodthabGL,Goose_BayCA,Grand_TurkTC',
  'America/GrenadaGD,GuadeloupeGP,GuatemalaGT,GuayaquilEC,GuyanaGY',
  'America/HalifaxCA,HavanaCU,HermosilloMX,Indiana/IndianapolisUS',
  'America/Indiana/KnoxUS,Indiana/MarengoUS,Indiana/PetersburgUS',
  'America/Indiana/Tell_CityUS,Indiana/VevayUS,Indiana/VincennesUS',
  'America/Indiana/WinamacUS,IndianapolisUS,InuvikCA,IqaluitCA',
  'America/JamaicaJM,JuneauUS,Kentucky/LouisvilleUS',
  'America/Kentucky/MonticelloUS,KralendijkBQ,La_PazBO,LimaPE',
  'America/Los_AngelesUS,LouisvilleUS,Lower_PrincesSX,MaceioBR',
  'America/ManaguaNI,ManausBR,MarigotMF,MartiniqueMQ,MatamorosMX',
  'America/MazatlanMX,MenomineeUS,MeridaMX,MetlakatlaUS,Mexico_CityMX',
  'America/MiquelonPM,MonctonCA,MonterreyMX,MontevideoUY,MontserratMS',
  'America/NassauBS,New_YorkUS,NipigonCA,NomeUS,NoronhaBR',
  'America/North_Dakota/BeulahUS,North_Dakota/CenterUS',
  'America/North_Dakota/New_SalemUS,NuukGL,OjinagaMX,PanamaPA',
  'America/PangnirtungCA,ParamariboSR,PhoenixUS,Port-au-PrinceHT',
  'America/Port_of_SpainTT,Porto_VelhoBR,Puerto_RicoPR,Punta_ArenasCL',
  'America/Rainy_RiverCA,Rankin_InletCA,RecifeBR,ReginaCA,ResoluteCA',
  'America/Rio_BrancoBR,SantaremBR,SantiagoCL,Santo_DomingoDO',
  'America/Sao_PauloBR,ScoresbysundGL,SitkaUS,St_BarthelemyBL',
  'America/St_JohnsCA,St_KittsKN,St_LuciaLC,St_ThomasVI,St_VincentVC',
  'America/Swift_CurrentCA,TegucigalpaHN,ThuleGL,Thunder_BayCA',
  'America/TijuanaMX,TorontoCA,TortolaVG,VancouverCA,WhitehorseCA',
  'America/WinnipegCA,YakutatUS,YellowknifeCA',
  'Antarctica/CaseyAQ,DavisAQ,DumontDUrvilleAQ,MacquarieAU,MawsonAQ',
  'Antarctica/McMurdoAQ,PalmerAQ,RotheraAQ,SyowaAQ,TrollAQ,VostokAQ',
  'Arctic/LongyearbyenSJ',
  'Asia/AdenYE,AlmatyKZ,AmmanJO,AnadyrRU,AqtauKZ,AqtobeKZ,AshgabatTM',
  'Asia/AtyrauKZ,BaghdadIQ,BahrainBH,BakuAZ,BangkokTH,BarnaulRU',
  'Asia/BeirutLB,BishkekKG,BruneiBN,CalcuttaIN,ChitaRU,ChoibalsanMN',
  'Asia/ColomboLK,DamascusSY,DhakaBD,DiliTL,DubaiAE,DushanbeTJ',
  'Asia/FamagustaCY,GazaPS,HebronPS,Ho_Chi_MinhVN,Hong_KongHK,HovdMN',
  'Asia/IrkutskRU,JakartaID,JayapuraID,JerusalemIL,KabulAF,KamchatkaRU',
  'Asia/KarachiPK,KathmanduNP,KatmanduNP,KhandygaRU,KolkataIN',
  'Asia/KrasnoyarskRU,Kuala_LumpurMY,KuchingMY,KuwaitKW,MacauMO',
  'Asia/MagadanRU,MakassarID,ManilaPH,MuscatOM,NicosiaCY,NovokuznetskRU',
  'Asia/NovosibirskRU,OmskRU,OralKZ,Phnom_PenhKH,PontianakID',
  'Asia/PyongyangKP,QatarQA,QostanayKZ,QyzylordaKZ,RangoonMM,RiyadhSA',
  'Asia/SaigonVN,SakhalinRU,SamarkandUZ,SeoulKR,ShanghaiCN,SingaporeSG',
  'Asia/SrednekolymskRU,TaipeiTW,TashkentUZ,TbilisiGE,TehranIR',
  'Asia/ThimphuBT,TokyoJP,TomskRU,UlaanbaatarMN,UrumqiCN,Ust-NeraRU',
  'Asia/VientianeLA,VladivostokRU,YakutskRU,YangonMM,YekaterinburgRU',
  'Asia/YerevanAM',
  'Atlantic/AzoresPT,BermudaBM,CanaryES,Cape_VerdeCV,FaeroeFO,FaroeFO',
  'Atlantic/MadeiraPT,ReykjavikIS,South_GeorgiaGS,St_HelenaSH,StanleyFK',
  'Australia/AdelaideAU,BrisbaneAU,Broken_HillAU,DarwinAU,EuclaAU',
  'Australia/HobartAU,LindemanAU,Lord_HoweAU,MelbourneAU,PerthAU',
  'Australia/SydneyAU',
  'Europe/AmsterdamNL,AndorraAD,AstrakhanRU,AthensGR,BelgradeRS',
  'Europe/BerlinDE,BratislavaSK,BrusselsBE,BucharestRO,BudapestHU',
  'Europe/BusingenDE,ChisinauMD,CopenhagenDK,DublinIE,GibraltarGI',
  'Europe/GuernseyGG,HelsinkiFI,Isle_of_ManIM,IstanbulTR,JerseyJE',
  'Europe/KaliningradRU,KievUA,KirovRU,KyivUA,LisbonPT,LjubljanaSI',
  'Europe/LondonGB,LuxembourgLU,MadridES,MaltaMT,MariehamnAX,MinskBY',
  'Europe/MonacoMC,MoscowRU,OsloNO,ParisFR,PodgoricaME,PragueCZ,RigaLV',
  'Europe/RomeIT,SamaraRU,San_MarinoSM,SarajevoBA,SaratovRU',
  'Europe/SimferopolUA,SkopjeMK,SofiaBG,StockholmSE,TallinnEE,TiraneAL',
  'Europe/UlyanovskRU,UzhgorodUA,VaduzLI,VaticanVA,ViennaAT,VilniusLT',
  'Europe/VolgogradRU,WarsawPL,ZagrebHR,ZaporozhyeUA,ZurichCH',
  'Indian/AntananarivoMG,ChagosIO,ChristmasCX,CocosCC,ComoroKM',
  'Indian/KerguelenTF,MaheSC,MaldivesMV,MauritiusMU,MayotteYT,ReunionRE',
  'Pacific/ApiaWS,AucklandNZ,BougainvillePG,ChathamNZ,ChuukFM,EasterCL',
  'Pacific/EfateVU,EnderburyKI,FakaofoTK,FijiFJ,FunafutiTV,GalapagosEC',
  'Pacific/GambierPF,GuadalcanalSB,GuamGU,HonoluluUS,KiritimatiKI',
  'Pacific/KosraeFM,KwajaleinMH,MajuroMH,MarquesasPF,MidwayUM,NauruNR',
  'Pacific/NiueNU,NorfolkNF,NoumeaNC,Pago_PagoAS,PalauPW,PitcairnPN',
  'Pacific/PohnpeiFM,PonapeFM,Port_MoresbyPG,RarotongaCK,SaipanMP',
  'Pacific/TahitiPF,TarawaKI,TongatapuTO,TrukFM,WakeUM,WallisWF',
];

let regions: ReadonlyMap<string, string> | undefined;

/** The zones' regions, unpacked (at first use). */
const regionsOf = () => {
  if (regions) return regions;
  const map = new Map<string, string>();
  for (const line of packed) {
    const slash = line.indexOf('/');
    const area = line.slice(0, slash);
    for (const entry of line.slice(slash + 1).split(',')) {
      map.set(`${area}/${entry.slice(0, -2)}`, entry.slice(-2));
    }
  }
  regions = map;
  return map;
};

/** The time zone's region, if it's known (read anew each time). */
export const regionOfTimeZone = (): string | undefined => {
  const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();
  return regionsOf().get(timeZone);
};
