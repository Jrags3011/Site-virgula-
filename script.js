// Script para funcionalidade do carrinho, pesquisa, filtro e navegação

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Adiciona evento de clique para cada botão "Adicionar ao Carrinho"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Impede que o clique no botão propague para o card do produto
            const productCard = this.closest('.product-card');
            
            // Adicionar ao carrinho
            addProductToCart(productCard);
            
            // Feedback visual
            this.textContent = "Adicionado ✓";
            this.style.backgroundColor = "#4CAF50";
            
            const currentButton = this;
            setTimeout(function() {
                currentButton.textContent = "Adicionar ao Carrinho";
                currentButton.style.backgroundColor = "#111";
            }, 1500);
        });
    });

    // Carregar contador do carrinho ao inicializar
    updateCartCount();
    
    // Adiciona evento de clique para itens do menu lateral (sidebar)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove a classe 'active' de todos os itens
            navItems.forEach(i => i.classList.remove('active'));
            // Adiciona a classe 'active' ao item clicado
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            if (category === 'Início') {
                showAllProducts();
                // Opcional: rolar para o topo ou para a seção de produtos
                document.querySelector('.welcome-banner').scrollIntoView({ behavior: 'smooth' });
            } else {
                filterProductsByCategory(category);
                // Rolar para a seção de produtos após o filtro
                document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Adiciona evento de clique para itens de categoria rápida
    const quickCategoryItems = document.querySelectorAll('.quick-categories .category-item');
    quickCategoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
            // Atualizar o item ativo na sidebar
            navItems.forEach(i => i.classList.remove('active'));
            document.querySelector(`.nav-item[data-category="${category}"]`).classList.add('active');
            // Rolar para a seção de produtos após o filtro
            document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Funcionalidade de pesquisa
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterProducts(searchTerm);
        // Rolar para a seção de produtos após a pesquisa
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Pesquisar quando o botão de pesquisa for clicado
    searchBtn.addEventListener('click', performSearch);

    // Pesquisar quando a tecla Enter for pressionada no campo de busca
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Função para filtrar produtos baseado no termo de pesquisa
    function filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        const productsGrid = document.querySelector('.products-grid');
        let foundProducts = 0;
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                card.style.display = 'block';
                foundProducts++;
            } else {
                card.style.display = 'none';
            }
        });

        // Exibe mensagem se nenhum produto for encontrado
        const existingMessage = document.querySelector('.no-products-message');
        if (foundProducts === 0 && !existingMessage) {
            const message = document.createElement('div');
            message.className = 'no-products-message';
            message.textContent = `Nenhum produto encontrado para "${searchTerm}"`;
            productsGrid.appendChild(message);
        } else if (foundProducts > 0 && existingMessage) {
            existingMessage.remove();
        }
    }

    // Função para filtrar produtos por categoria
    function filterProductsByCategory(category) {
        const productCards = document.querySelectorAll('.product-card');
        const productsGrid = document.querySelector('.products-grid');
        let foundProducts = 0;

        // Remove mensagem de "nenhum produto encontrado" se existir
        const existingMessage = document.querySelector('.no-products-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        productCards.forEach(card => {
            const productCategory = card.querySelector('.product-category').textContent;
            
            if (productCategory === category) {
                card.style.display = 'block';
                foundProducts++;
            } else {
                card.style.display = 'none';
            }
        });

        if (foundProducts === 0) {
            const message = document.createElement('div');
            message.className = 'no-products-message';
            message.textContent = `Nenhum produto encontrado na categoria "${category}"`;
            productsGrid.appendChild(message);
        }
    }

    // Função para mostrar todos os produtos
    function showAllProducts() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
        });

        // Remove mensagem de "nenhum produto encontrado" se existir
        const existingMessage = document.querySelector('.no-products-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    // Limpa o campo de pesquisa e mostra todos os produtos quando a página carrega
    searchInput.value = '';
    showAllProducts();

    // Função para abrir o carrinho
    window.openCart = function() {
        window.location.href = 'carrinho.html';
    }

    // Função para adicionar produto ao carrinho
    function addProductToCart(productElement) {
        const productInfo = {
            id: productElement.getAttribute('data-id'), // Usar o data-id para o ID do produto
            name: productElement.querySelector('.product-name').textContent,
            category: productElement.querySelector('.product-category').textContent,
            price: parseFloat(productElement.querySelector('.product-price').textContent.replace('R$ ', '').replace(',', '.')),
            quantity: 1,
            image: productElement.querySelector('img') ? productElement.querySelector('img').alt : 'Produto' // Usar o alt da imagem como placeholder
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const existingProduct = cart.find(item => item.id === productInfo.id); // Buscar pelo ID
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(productInfo);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Atualizar contador do carrinho
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    // Funcionalidade de clique no card do produto para ir para a página de detalhes
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            // Redireciona para uma página de detalhes do produto, passando o ID na URL
        window.location.href = `detalhes.html?id=${productId}`;
        });
    });

    // Ajuste para o botão "Ver Produtos" no banner
    document.querySelector('.welcome-banner .cta-button').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    });
});
