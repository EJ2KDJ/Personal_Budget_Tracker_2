export async function initTransfers() {
    await loadTransfers();
    await setupTransferForm();
}

let allTransfers = [];
let envelopes = [];

async function loadTransfers() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
        const res = await fetch(`/transfers/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load transfers:", errorText);
            return;
        }

        const data = await res.json();
        allTransfers = data.transfers || [];

    const transferList = document.getElementById("transferHistory");
        transferList.innerHTML = "";
        if (allTransfers.length === 0) {
            transferList.innerHTML = "<p>No transfers found.</p>";
            return;
        }
        allTransfers.forEach(transfer => {
            const transferEl = document.createElement("div");
            transferEl.classList.add("transfer-item");
            transferEl.innerHTML = `
                <p>From Envelope: ${transfer.from_envelope}</p>
                <p>To Envelope: ${transfer.to_envelope}</p>
                <p>Amount: $${transfer.amount.toFixed(2)}</p>
                <p>Date: ${new Date(transfer.date).toLocaleDateString()}</p>
            `;
            transferList.appendChild(transferEl);
        });
    } catch (err) {
        console.error("Error loading transfers:", err);
    }
}

async function loadEnvelopes() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
        const res = await fetch(`/envelopes/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error("Failed to fetch envelopes");
        const data = await res.json();
        envelopes = data.envelopes || [];
    } catch (err) {
        console.error("Error loading envelopes:", err);
        return [];
    }
}

function findEnvelopeIdByName(name) {
    if (!name) return null;
    const lower = String(name).toLowerCase();
    const envelope = envelopes.find(env => {
        const title = (env.title || env.name || '').toString().toLowerCase();
        return title === lower;
    });
    return envelope ? envelope.id : null;
}

async function setupTransferForm() {
    const form = document.getElementById("transferForm");
    if (!form) return;
    
    // Load envelopes when setting up the form
    await loadEnvelopes();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

    const fromEnvelopeId = findEnvelopeIdByName(form.fromEnvelope.value);
    const toEnvelopeId = findEnvelopeIdByName(form.toEnvelope.value);

        if (!fromEnvelopeId || !toEnvelopeId) {
            alert("One or both envelope names were not found. Please check the names and try again.");
            return;
        }

        const transferData = {
            from_envelope: fromEnvelopeId,
            to_envelope: toEnvelopeId,
            amount: parseFloat(form.amount.value),
            date: new Date().toISOString()
        };

        if (!transferData.from_envelope || !transferData.to_envelope || isNaN(transferData.amount)) {
            alert("Please fill out all fields correctly.");
            return;
        }

        try {
            // Create the transfer
            const res = await fetch(`/transfers`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transferData),
            });

            if (res.ok) {
                alert("Transfer created successfully!");
                form.reset();
                await loadTransfers();
            } else {
                const errorText = await res.text();
                alert(`Error: ${errorText || 'Failed to create transfer'}`);
            }
        } catch (err) {
            console.error("Error creating transfer:", err);
        }
    });
}