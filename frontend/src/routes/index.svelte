<script>
    let productId = ''
    let prices

    const getPrice = async () => {
        let url = `http://localhost:3333/find/${productId}`
        prices = await fetch(url).then(r => r.json());
        console.log(prices)
    }

</script>

<h1>Welcome to Web Scraper</h1>
<h2>Searching for: {productId}</h2>


<input bind:value={productId}/>
<button on:click={getPrice}>Submit</button>

<div>
    {#if prices}
    <h2>{prices.title}</h2>
    <p>{prices.productId}</p>
    {:else}
    <p>Search for a product</p>
    {/if}
</div>