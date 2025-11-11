import { Component } from 'react'
import { TailSpin } from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    isLoading: false,
    fetchError: false,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({ isLoading: true, fetchError: false })
    const apiUrl = 'https://ecomerse-backend-production.up.railway.app/prime-deals'

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error('Failed to fetch prime deals')

      const fetchedData = await response.json()

      const updatedData = Array.isArray(fetchedData)
        ? fetchedData.map(product => ({
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            imageUrl: product.imageUrl,
            rating: product.rating,
          }))
        : []

      this.setState({ primeDeals: updatedData, isLoading: false })
    } catch (error) {
      console.error('Error fetching prime deals:', error)
      this.setState({ primeDeals: [], isLoading: false, fetchError: true })
    }
  }

  renderPrimeDealsList = () => {
    const { primeDeals, fetchError } = this.state

    if (fetchError) {
      return (
        <div className="prime-deals-failure">
          <img
            src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
            alt="Register Prime"
            className="register-prime-image"
          />
          <p className="failure-text">Failed to load Prime Deals. Please try again later.</p>
        </div>
      )
    }

    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        {primeDeals.length === 0 ? (
          <div className="no-products">No prime deals available</div>
        ) : (
          <ul className="products-list">
            {primeDeals.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <TailSpin height={50} width={50} color="#00BFFF" />
    </div>
  )

  render() {
    const { isLoading } = this.state
    return isLoading ? this.renderLoader() : this.renderPrimeDealsList()
  }
}

export default PrimeDealsSection
