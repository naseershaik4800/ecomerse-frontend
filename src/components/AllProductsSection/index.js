import { Component } from 'react'
import { TailSpin } from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    fetchError: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
      fetchError: false,
    })

    const jwtToken = Cookies.get('jwt_token')
    const { activeOptionId } = this.state
    const apiUrl = `https://ecomerse-backend-production.up.railway.app/products?sort_by=${activeOptionId}`

    const options = {
      method: 'GET',
      headers: {},
    }

    if (jwtToken) {
      options.headers.Authorization = `Bearer ${jwtToken}`
    }

    try {
      const response = await fetch(apiUrl, options)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const fetchedData = await response.json()

      const updatedData = fetchedData.products.map(product => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        imageUrl: product.imageUrl, 
        rating: product.rating,
      }))

      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      this.setState({
        productsList: [],
        isLoading: false,
        fetchError: true,
      })
    }
  }

  updateActiveOptionId = activeOptionId => {
    this.setState({ activeOptionId }, this.getProducts)
  }

  renderProductsList = () => {
    const { productsList, activeOptionId, fetchError } = this.state

    if (fetchError) {
      return (
        <div className="products-error">
          Failed to load products. Please try again later.
        </div>
      )
    }

    return (
      <>
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          updateActiveOptionId={this.updateActiveOptionId}
        />
        {productsList.length === 0 ? (
          <div className="no-products">No products available</div>
        ) : (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <TailSpin height={50} width={50} color="#00BFFF" />
    </div>
  )

  render() {
    const { isLoading } = this.state
    return isLoading ? this.renderLoader() : this.renderProductsList()
  }
}

export default AllProductsSection
