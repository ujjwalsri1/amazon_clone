document.addEventListener("DOMContentLoaded", function() {
    const checkDeliveryButton = document.querySelector(".button");
    const pincodeInput = document.querySelector(".pincode-input");
    const resultDiv = document.querySelector(".result");
    const errorDiv = document.querySelector(".error");
    const boxes = document.querySelectorAll(".shop-section .box");

    let selectedProduct = null;
    let pincodes = []; // Initialize pincodes as an empty array

    const products = [
        { id: 1, inStock: true },
        { id: 2, inStock: true },
        // Add more products as needed
    ];

    // Fetch pincodes from the CSV file
    fetch('pincode.csv')
        .then(response => response.text())
        .then(data => {
            // Parse the CSV data
            pincodes = data.split('\n').map(line => line.trim()).filter(line => line); // Split by new line and trim whitespace
        })
        .catch(error => {
            console.error('Error fetching pincode file:', error);
            errorDiv.textContent = 'Failed to load pincodes.';
        }); // Closing parenthesis was missing here

    // Add click event listener to the product boxes
    boxes.forEach(box => {
        box.addEventListener("click", function() {
            selectedProduct = products.find(p => p.id === parseInt(box.getAttribute("data-product")));
            boxes.forEach(b => b.classList.remove("selected")); // Clear previous selection
            box.classList.add("selected"); // Highlight selected box
        });
    });

    // Add click event listener to the delivery check button
    checkDeliveryButton.addEventListener("click", function() {
        estimateDelivery();
    });

    function estimateDelivery() {
        errorDiv.textContent = '';

        if (!selectedProduct) {
            errorDiv.textContent = 'Please select a product.';
            return;
        }

        const pincode = pincodeInput.value.trim();
        if (!pincode || !pincodes.includes(pincode)) {
            errorDiv.textContent = 'Invalid pincode.';
            return;
        }

        const currentTime = new Date();
        const cutoffA = new Date();
        cutoffA.setHours(17, 0, 0);
        const cutoffB = new Date();
        cutoffB.setHours(9, 0, 0);

        let provider = '';
        let deliveryDate = '';

        // Delivery logic
        if (selectedProduct.inStock && currentTime < cutoffA) {
            provider = 'Provider A';
            deliveryDate = new Date();
            deliveryDate.setHours(17, 0, 0); // Same day delivery by 5 PM
        } else if (selectedProduct.inStock && currentTime < cutoffB) {
            provider = 'Provider B';
            deliveryDate = new Date();
            deliveryDate.setHours(9, 0, 0); // Next day delivery by 9 AM
            deliveryDate.setDate(deliveryDate.getDate() + 1);
        } else {
            provider = 'General Partners';
            deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3); // Delivery in 3 days
        }

        // Display results
        resultDiv.textContent = `Delivery by ${provider} on ${deliveryDate.toDateString()}`;
    }
});
