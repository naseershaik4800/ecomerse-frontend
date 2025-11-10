import { Component } from 'react'
import Cookies from 'js-cookie'
import { TailSpin } from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress })

    const jwtToken = Cookies.get('jwt_token')

 
    const apiUrl = 'https://ecomerse-backend-production.up.railway.app/prime-deals'

    const options = { method: 'GET', headers: {} }
    if (jwtToken) {
      options.headers.Authorization = `Bearer ${jwtToken}`
    }

    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) {
        if (response.status === 401) {
          this.setState({ apiStatus: apiStatusConstants.failure })
        } else {
          throw new Error('Failed to fetch prime deals')
        }
        return
      }

      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        imageUrl: product.imageUrl,
        rating: product.rating,
      }))

      this.setState({
        primeDeals: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } catch (error) {
      console.error('Error fetching prime deals:', error)
      this.setState({ apiStatus: apiStatusConstants.failure })
    }
  }

  renderPrimeDealsList = () => {
    const { primeDeals } = this.state
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

  renderPrimeDealsFailureView = () => (
    <div className="prime-deals-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="Register Prime"
        className="register-prime-image"
      />
      <p className="failure-text">
        Failed to load Prime Deals. Please login or register for Prime.
      </p>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <TailSpin height={50} width={50} color="#00BFFF" />
    </div>
  )

  render() {
    const { apiStatus } = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsList()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
