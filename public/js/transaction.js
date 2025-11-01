export async function initTransactions() {
    await loadEnvelopes();
    await loadTransactions();
    setupTransactionForm();
}

let allTransactions = [];
let envelopes = [];

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
        
        console.log('Loaded envelopes:', envelopes);
        populateEnvelopeSelect();
    } catch (err) {
        console.error("Error loading envelopes:", err);
        alert("Error loading envelopes. Please refresh the page.");
    }
}

function populateEnvelopeSelect() {
    const envelopeSelect = document.getElementById('transactionEnvelope');
    
    if (!envelopeSelect) return;

    envelopeSelect.innerHTML = '<option value="">Select envelope...</option>';
    
    envelopes.forEach(env => {
        const option = document.createElement('option');
        option.value = env.id;
        option.textContent = `${env.title} (₱${parseFloat(env.budget).toFixed(2)})`;
        envelopeSelect.appendChild(option);
    });
}

async function loadTransactions() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
        const res = await fetch(`/transactions/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to fetch transactions:", errorText);
            document.getElementById("transactionHistory").innerHTML = "<p>Error loading transactions</p>";
            return;
        }

        const data = await res.json();
        allTransactions = data.userResults || [];

        const transactionList = document.getElementById("transactionHistory");
        transactionList.innerHTML = "";

        if (allTransactions.length === 0) {
            transactionList.innerHTML = "<p>No transactions found.</p>";
            return;
        }

        allTransactions.forEach(tx => {
            const envelope = envelopes.find(e => e.id === tx.envelope_id);
            const txItem = document.createElement("div");
            txItem.className = "transaction-item";
            txItem.innerHTML = `
                <p><strong>Type:</strong> ${tx.type.toUpperCase()}</p>
                <p><strong>Envelope:</strong> ${envelope ? envelope.title : 'Unknown'}</p>
                <p><strong>Amount:</strong> ₱${parseFloat(tx.amount).toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(tx.date).toLocaleDateString()}</p>
                ${tx.description ? `<p><strong>Description:</strong> ${tx.description}</p>` : ''}
            `;
            transactionList.appendChild(txItem);
        });
    } catch (err) {
        console.error("Error loading transactions:", err);
        document.getElementById("transactionHistory").innerHTML = "<p>Error loading transactions</p>";
    }
}

function setupTransactionForm() {
    const form = document.getElementById('transactionForm');
    const envelopeSelect = document.getElementById('transactionEnvelope');
    const typeSelect = document.getElementById('transactionType');
    const amountInput = document.getElementById('transactionAmount');

    if (!form) return;

    // Show envelope balance when selected
    envelopeSelect.addEventListener('change', () => {
        const envId = parseInt(envelopeSelect.value);
        const env = envelopes.find(e => e.id === envId);
        
        // You can add a balance display element if you want
        console.log('Selected envelope budget:', env ? env.budget : 'N/A');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        const envelopeId = parseInt(envelopeSelect.value);
        const type = typeSelect.value;
        const amount = parseFloat(amountInput.value);

        // Validation
        if (!envelopeId) {
            alert("Please select an envelope");
            return;
        }

        if (!type) {
            alert("Please select a transaction type");
            return;
        }

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        // Check if expense exceeds envelope budget
        const envelope = envelopes.find(e => e.id === envelopeId);
        if (type === 'expense' && envelope) {
            const currentBudget = parseFloat(envelope.budget);
            if (amount > currentBudget) {
                alert(`Expense amount (₱${amount.toFixed(2)}) exceeds envelope budget (₱${currentBudget.toFixed(2)})`);
                return;
            }
        }

        const transactionData = {
            envelope_id: envelopeId,
            type: type,
            amount: amount,
            date: new Date().toISOString(),
            description: '' // You can add a description field if needed
        };

        console.log('Sending transaction:', transactionData);

        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            const res = await fetch(`/transactions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData),
            });

            const responseData = await res.json();
            console.log('Transaction response:', responseData);

            if (res.ok) {
                alert("Transaction created successfully!");
                form.reset();
                await loadEnvelopes(); // Reload to get updated balances
                await loadTransactions();
            } else {
                alert(`Error: ${responseData.error || responseData.message || 'Failed to create transaction'}`);
            }
        } catch (err) {
            console.error("Error creating transaction:", err);
            alert("Error creating transaction");
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Perform Transaction';
        }
    });
}