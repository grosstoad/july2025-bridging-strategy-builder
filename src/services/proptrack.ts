// PropTrack API service

import { 
  AddressSuggestionsResponse, 
  PropTrackPropertySummary,
  MedianSalePriceRequest,
  MedianDaysOnMarketRequest,
  PotentialBuyersRequest,
  MarketMetricResponse
} from '../types/proptrack';

const API_BASE_URL = '/api';

export class PropTrackService {
  private static async makeRequest<T>(
    endpoint: string, 
    method: string = 'GET',
    params?: Record<string, any>
  ): Promise<T> {
    let url = `${API_BASE_URL}${endpoint}`;
    
    if (method === 'GET' && params) {
      const queryParams = new URLSearchParams(params).toString();
      url = `${url}?${queryParams}`;
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method !== 'GET' && params ? { body: JSON.stringify(params) } : {})
    });
    
    if (!response.ok) {
      throw new Error(`PropTrack API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getAddressSuggestions(query: string): Promise<AddressSuggestionsResponse> {
    if (query.length < 3) {
      return { results: [] };
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await this.makeRequest<any>(`/v2/address/suggest?q=${encodedQuery}`);
      
      // PropTrack API returns array directly, not wrapped in {results: []}
      const formattedResponse: AddressSuggestionsResponse = {
        results: Array.isArray(response) ? response : []
      };
      
      return formattedResponse;
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      throw error;
    }
  }

  static async getPropertySummary(propertyId: string): Promise<PropTrackPropertySummary> {
    try {
      return await this.makeRequest<PropTrackPropertySummary>(`/v2/properties/${propertyId}/summary`);
    } catch (error) {
      console.error('Error fetching property summary:', error);
      throw error;
    }
  }

  static async getMedianSalePrice(params: MedianSalePriceRequest): Promise<MarketMetricResponse[]> {
    try {
      return await this.makeRequest<MarketMetricResponse[]>(
        '/v2/market/sale/historic/median-sale-price',
        'GET',
        params
      );
    } catch (error) {
      console.error('Error fetching median sale price:', error);
      throw error;
    }
  }

  static async getMedianDaysOnMarket(params: MedianDaysOnMarketRequest): Promise<MarketMetricResponse[]> {
    try {
      return await this.makeRequest<MarketMetricResponse[]>(
        '/v2/market/sale/historic/median-days-on-market',
        'GET',
        params
      );
    } catch (error) {
      console.error('Error fetching median days on market:', error);
      throw error;
    }
  }

  static async getPotentialBuyersSupplyDemand(params: PotentialBuyersRequest): Promise<MarketMetricResponse[]> {
    try {
      return await this.makeRequest<MarketMetricResponse[]>(
        '/v2/market/supply-and-demand/potential-buyers',
        'GET',
        params
      );
    } catch (error) {
      console.error('Error fetching supply and demand data:', error);
      throw error;
    }
  }
}