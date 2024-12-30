const apiUrl = 'http://localhost:3000';
        async function addProduct() {
            const name = document.getElementById('name').value;
            const category = document.getElementById('category').value;
            const price = document.getElementById('price').value;
            const description = document.getElementById('description').value;

            const response = await fetch(`${apiUrl}/add-product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, price, description })
            });

            if (response.ok) {
                //ajouter 
                alert('Product added successfully!');
            } else {
                alert('Error adding product.');
            }
        }

        async function searchProducts() {
            const name = document.getElementById('search-name').value;
            const category = document.getElementById('search-category').value;
            const min_price = document.getElementById('search-min-price').value || 0;
            const max_price = document.getElementById('search-max-price').value || 999999999999;

            const response = await fetch(`${apiUrl}/search-products?name=${name}&category=${category}&min_price=${min_price}&max_price=${max_price}`);
            console.log(response.url);
            
            const products = await response.json();
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (products.length > 0) {
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Price: $${product.price}</p>
                        <p>Description: ${product.description}</p>
                    `;
                    resultsDiv.appendChild(productDiv);
                });
            } else {
                resultsDiv.innerHTML = '<p>No products found.</p>';
            }
        }