// n=name, c=country, r=role, m=matches, runs, avg=batting avg, sr=strike rate,
// h=100s, f=50s, w=wickets, ba=bowling avg, e=economy  (approximate sample data)
const players = [
 {n:"Virat Kohli",c:"India",r:"Batter",m:295,runs:13906,avg:58.7,sr:93.5,h:50,f:72,w:5,ba:166,e:6.3},
 {n:"Rohit Sharma",c:"India",r:"Batter",m:273,runs:11168,avg:48.8,sr:92.8,h:32,f:58,w:8,ba:53,e:5.1},
 {n:"Sachin Tendulkar",c:"India",r:"Batter",m:463,runs:18426,avg:44.8,sr:86.2,h:49,f:96,w:154,ba:44.5,e:5.1},
 {n:"MS Dhoni",c:"India",r:"Wicketkeeper",m:350,runs:10773,avg:50.6,sr:87.6,h:10,f:73,w:1,ba:31,e:3.3},
 {n:"Jasprit Bumrah",c:"India",r:"Bowler",m:89,runs:80,avg:8,sr:70,h:0,f:0,w:149,ba:23.5,e:4.6},
 {n:"Ravindra Jadeja",c:"India",r:"All-rounder",m:197,runs:2756,avg:32.9,sr:87,h:0,f:13,w:220,ba:36.6,e:4.9},
 {n:"Ricky Ponting",c:"Australia",r:"Batter",m:375,runs:13704,avg:42.0,sr:80.4,h:30,f:82,w:3,ba:34,e:5.4},
 {n:"Steve Smith",c:"Australia",r:"Batter",m:155,runs:5800,avg:43,sr:87,h:12,f:35,w:28,ba:38,e:5.7},
 {n:"Pat Cummins",c:"Australia",r:"Bowler",m:90,runs:600,avg:17,sr:95,h:0,f:0,w:148,ba:28,e:5.3},
 {n:"Glenn Maxwell",c:"Australia",r:"All-rounder",m:140,runs:3990,avg:34,sr:126,h:4,f:23,w:70,ba:49,e:5.6},
 {n:"Joe Root",c:"England",r:"Batter",m:175,runs:6800,avg:51,sr:87,h:16,f:40,w:30,ba:50,e:5.6},
 {n:"Ben Stokes",c:"England",r:"All-rounder",m:114,runs:3400,avg:39,sr:95,h:3,f:21,w:74,ba:42,e:5.6},
 {n:"Jos Buttler",c:"England",r:"Wicketkeeper",m:180,runs:5100,avg:40,sr:118,h:11,f:29,w:0,ba:0,e:0},
 {n:"Babar Azam",c:"Pakistan",r:"Batter",m:120,runs:5900,avg:56,sr:88,h:19,f:34,w:0,ba:0,e:0},
 {n:"Shaheen Afridi",c:"Pakistan",r:"Bowler",m:55,runs:220,avg:8,sr:80,h:0,f:0,w:112,ba:24,e:5.5},
 {n:"Shahid Afridi",c:"Pakistan",r:"All-rounder",m:398,runs:8064,avg:23.6,sr:117,h:6,f:39,w:395,ba:34,e:4.7},
 {n:"Kane Williamson",c:"New Zealand",r:"Batter",m:165,runs:6800,avg:48,sr:81,h:13,f:45,w:37,ba:43,e:5.5},
 {n:"Trent Boult",c:"New Zealand",r:"Bowler",m:115,runs:480,avg:9,sr:75,h:0,f:0,w:200,ba:25,e:5.0},
 {n:"Kumar Sangakkara",c:"Sri Lanka",r:"Wicketkeeper",m:404,runs:14234,avg:42,sr:78.9,h:25,f:93,w:0,ba:0,e:0},
 {n:"Muttiah Muralitharan",c:"Sri Lanka",r:"Bowler",m:350,runs:674,avg:6.8,sr:77,h:0,f:0,w:534,ba:23.1,e:3.9},
 {n:"AB de Villiers",c:"South Africa",r:"Wicketkeeper",m:228,runs:9577,avg:53.5,sr:101.1,h:25,f:53,w:7,ba:40,e:5.9},
 {n:"Quinton de Kock",c:"South Africa",r:"Wicketkeeper",m:155,runs:6700,avg:45,sr:96,h:21,f:30,w:0,ba:0,e:0},
 {n:"Kagiso Rabada",c:"South Africa",r:"Bowler",m:100,runs:330,avg:10,sr:85,h:0,f:0,w:160,ba:27,e:5.2},
 {n:"Shakib Al Hasan",c:"Bangladesh",r:"All-rounder",m:247,runs:7570,avg:37.7,sr:82,h:9,f:56,w:317,ba:29.8,e:4.4},
 {n:"Rashid Khan",c:"Afghanistan",r:"Bowler",m:110,runs:1500,avg:16,sr:105,h:0,f:2,w:190,ba:18.5,e:4.2}
];

const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString("en-IN");
let sortKey = "runs", sortDir = -1, charts = {};

// ---- filters ----
[...new Set(players.map(p => p.c))].sort().forEach(c => $("country").add(new Option(c, c)));
players.forEach(p => { $("p1").add(new Option(p.n, p.n)); $("p2").add(new Option(p.n, p.n)); });
$("p1").value = "Virat Kohli"; $("p2").value = "Babar Azam";

function filtered() {
  const q = $("search").value.trim().toLowerCase(), c = $("country").value, r = $("role").value;
  return players.filter(p => (!q || p.n.toLowerCase().includes(q)) && (!c || p.c === c) && (!r || p.r === r));
}

// ---- summary cards ----
function renderCards(d) {
  if (!d.length) { $("cards").innerHTML = ""; return; }
  const top = (k, rows = d) => rows.reduce((a, b) => (b[k] > a[k] ? b : a));
  const bat = d.filter(p => p.runs > 1000), bowl = d.filter(p => p.w >= 50);
  const items = [
    ["Players shown", d.length, "in current filter"],
    ["Most runs", fmt(top("runs").runs), top("runs").n],
    ["Best batting average", bat.length ? top("avg", bat).avg : "-", bat.length ? top("avg", bat).n : "no batters"],
    ["Highest strike rate", bat.length ? top("sr", bat).sr : "-", bat.length ? top("sr", bat).n : "no batters"],
    ["Most wickets", top("w").w, top("w").n],
    ["Best economy", bowl.length ? Math.min(...bowl.map(p => p.e)) : "-",
      bowl.length ? bowl.reduce((a, b) => (b.e < a.e ? b : a)).n : "no bowlers"]
  ];
  $("cards").innerHTML = items.map(i => `<div class="card"><small>${i[0]}</small><strong>${i[1]}</strong><span>${i[2]}</span></div>`).join("");
}

// ---- table ----
function renderTable(d) {
  const rows = [...d].sort((a, b) => {
    const x = a[sortKey], y = b[sortKey];
    return (typeof x === "string" ? x.localeCompare(y) : x - y) * sortDir;
  });
  document.querySelector("#table tbody").innerHTML = rows.map(p =>
    `<tr><td>${p.n}</td><td>${p.c}</td><td>${p.r}</td><td>${p.m}</td><td>${fmt(p.runs)}</td><td>${p.avg}</td>
     <td>${p.sr}</td><td>${p.h}</td><td>${p.f}</td><td>${p.w}</td><td>${p.ba || "-"}</td><td>${p.e || "-"}</td></tr>`).join("");
  document.querySelectorAll("th").forEach(th => {
    th.classList.remove("asc", "desc");
    if (th.dataset.k === sortKey) th.classList.add(sortDir === 1 ? "asc" : "desc");
  });
}
document.querySelectorAll("th").forEach(th => {
  th.tabIndex = 0;
  const go = () => {
    const k = th.dataset.k;
    sortDir = (k === sortKey) ? -sortDir : (k === "n" || k === "c" || k === "r" ? 1 : -1);
    sortKey = k; update();
  };
  th.addEventListener("click", go);
  th.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
});

// ---- charts ----
function draw(id, config) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart($(id), config);
}
function renderCharts(d) {
  const runs = [...d].sort((a, b) => b.runs - a.runs).slice(0, 10);
  draw("runsChart", { type: "bar",
    data: { labels: runs.map(p => p.n), datasets: [{ data: runs.map(p => p.runs), backgroundColor: "#16382d" }] },
    options: { indexAxis: "y", plugins: { legend: { display: false } } } });

  const wk = [...d].sort((a, b) => b.w - a.w).slice(0, 10);
  draw("wktChart", { type: "bar",
    data: { labels: wk.map(p => p.n), datasets: [{ data: wk.map(p => p.w), backgroundColor: "#a8272d" }] },
    options: { indexAxis: "y", plugins: { legend: { display: false } } } });

  const bat = d.filter(p => p.runs > 1000);
  draw("scatterChart", { type: "scatter",
    data: { datasets: [{ data: bat.map(p => ({ x: p.avg, y: p.sr, name: p.n })), backgroundColor: "#c79a2b", pointRadius: 6 }] },
    options: { plugins: { legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.raw.name}: avg ${c.raw.x}, SR ${c.raw.y}` } } },
      scales: { x: { title: { display: true, text: "Batting average" } }, y: { title: { display: true, text: "Strike rate" } } } } });
}

// ---- compare (radar, each axis scaled 0-100 against the best in the data) ----
function renderRadar() {
  const mx = k => Math.max(...players.map(p => p[k]));
  const minE = Math.min(...players.filter(p => p.e).map(p => p.e));
  const score = p => [
    p.runs / mx("runs"), p.avg / mx("avg"), p.sr / mx("sr"), p.w / mx("w"), p.e ? minE / p.e : 0
  ].map(v => Math.round(v * 100));
  const a = players.find(p => p.n === $("p1").value), b = players.find(p => p.n === $("p2").value);
  draw("radarChart", { type: "radar",
    data: { labels: ["Runs", "Bat avg", "Strike rate", "Wickets", "Economy"],
      datasets: [
        { label: a.n, data: score(a), borderColor: "#16382d", backgroundColor: "rgba(22,56,45,.2)" },
        { label: b.n, data: score(b), borderColor: "#a8272d", backgroundColor: "rgba(168,39,45,.2)" }] },
    options: { scales: { r: { min: 0, max: 100 } } } });
}

function update() { const d = filtered(); renderCards(d); renderTable(d); renderCharts(d); }
["search", "country", "role"].forEach(id => $(id).addEventListener("input", update));
["p1", "p2"].forEach(id => $(id).addEventListener("change", renderRadar));
update(); renderRadar();