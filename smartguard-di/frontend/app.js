const AGENTS = [
  { id: "llama-3.3-70b-versatile", name: "LLAMA-3.3 70B" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" }
];

document.getElementById("btn").addEventListener("click", startAudit);

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function startAudit() {
  const code = document.getElementById("inp").value.trim();
  const groqKey = document.getElementById("key-inp").value.trim();

  if (!groqKey) { alert("Security Block: Please configure your Groq API Key first!"); return; }
  if (!code) { alert("Please paste some Solidity code first!"); return; }

  document.getElementById("btn").disabled = true;
  document.getElementById("eb").classList.remove("on");
  document.getElementById("res").classList.remove("on");
  document.getElementById("log").classList.add("on");
  document.getElementById("ldr").classList.add("on");

  document.getElementById("log").innerHTML = "<div class='ll'>[INIT] Accessing localized browser session...</div>";

  const promises = AGENTS.map((agent, idx) => callAgent(agent, code, groqKey, idx));
  const results = await Promise.all(promises);

  document.getElementById("unified-output").innerHTML = `
    <div class="report-section">
      <div class="sec-title logic">🛡️ LLAMA-3.3-70B ARCHITECTURAL VERDICT</div>
      <div class="fdet">${escapeHtml(results[0])}</div>
    </div>
    <div class="divider"></div>
    <div class="report-section">
      <div class="sec-title remediation">🎯 GPT-OSS-120B SECURITY FIX & REMEDIATION</div>
      <div class="fdet">${escapeHtml(results[1])}</div>
    </div>
  `;

  document.getElementById("ldr").classList.remove("on");
  document.getElementById("res").classList.add("on");
  document.getElementById("btn").disabled = false;
}

async function callAgent(agent, code, groqKey, idx) {
  const bar = document.getElementById("bar-" + idx);
  bar.className = "abar active";
  document.getElementById("log").innerHTML += "<div class='ll'>[FETCHING] Routing encrypted query packet to " + agent.name + "...</div>";

  const systemPrompt = "You are an elite Smart Contract Security Auditor. Analyze the code for critical security bugs and re-entrancy vectors. Be highly technical, precise, and concise. Do not use conversational filler.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + groqKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: agent.id,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Audit this contract:\n\n" + code }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) throw new Error("Authentication/HTTP Error " + response.status);

    const data = await response.json();
    const verdict = data.choices[0].message.content;

    bar.className = "abar done";
    document.getElementById("log").innerHTML += "<div class='ll' style='color:var(--g)'>[SUCCESS] Sync lock acquired for " + agent.name + "</div>";
    return verdict;
  } catch (err) {
    console.error(err);
    bar.className = "abar fail";
    document.getElementById("log").innerHTML += "<div class='ll' style='color:var(--r)'>[CRITICAL] " + agent.name + " stream halted. Check your API key.</div>";
    return "Error fetching data from " + agent.name + ": " + err.message;
  }
}
