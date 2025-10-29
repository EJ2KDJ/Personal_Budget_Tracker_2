export async function initTransfers() {
    await loadTransfers();
}

let allTransfers = [];

async function loadTransfers() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
        const res = await fetch(`/transfers`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) throw new Error("Failed to fetch transfers");

        const data = await res.json();
        allTransfers = data.transfers || [];

        const transferList = document.getElementById("transferList");
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

