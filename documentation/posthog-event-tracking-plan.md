# PostHog event tracking plan

## API performance events

### api_call_initiated
**Trigger**: When any API call is initiated
**Properties**:
- `api_endpoint`: String (e.g., '/api/proptrack/address/suggest', '/api/proptrack/properties/:id/summary')
- `api_type`: String ('proptrack' | 'auspost')
- `request_timestamp`: ISO timestamp
- `session_id`: String
- `user_flow_stage`: String ('current_property' | 'target_property' | 'bridging_calculator')
- `request_id`: UUID for correlation

### api_call_success
**Trigger**: When an API call returns successfully (2xx status)
**Properties**:
- `api_endpoint`: String
- `api_type`: String ('proptrack' | 'auspost')
- `response_time_ms`: Number
- `response_size_bytes`: Number
- `result_count`: Number (for search endpoints)
- `cache_hit`: Boolean
- `request_id`: UUID

### api_call_failure
**Trigger**: When an API call fails (4xx, 5xx, network error)
**Properties**:
- `api_endpoint`: String
- `api_type`: String ('proptrack' | 'auspost')
- `error_code`: Number (HTTP status code)
- `error_message`: String
- `error_type`: String ('rate_limit' | 'auth_failure' | 'network' | 'server_error' | 'client_error')
- `retry_attempt`: Number
- `request_id`: UUID

### api_rate_limit_hit
**Trigger**: When a 429 rate limit error is received
**Properties**:
- `api_endpoint`: String
- `api_type`: String
- `retry_after_seconds`: Number
- `requests_in_window`: Number
- `rate_limit_window`: String

## Address search events

### address_search_performed
**Trigger**: When user types in address search field (debounced)
**Properties**:
- `search_query`: String (anonymized/hashed)
- `search_query_length`: Number
- `search_type`: String ('property' | 'suburb')
- `page_context`: String ('current_property' | 'target_property')
- `results_returned`: Number
- `proptrack_results`: Number
- `auspost_results`: Number
- `search_latency_ms`: Number

### address_selected
**Trigger**: When user selects an address from search results
**Properties**:
- `selection_source`: String ('proptrack' | 'auspost')
- `selection_index`: Number (position in results)
- `property_type`: String (if available)
- `state`: String
- `postcode`: String
- `time_to_select_ms`: Number (from search initiated)

## Property data events

### property_data_loaded
**Trigger**: When property summary data is successfully loaded
**Properties**:
- `property_id`: String (hashed)
- `data_source`: String ('api' | 'manual_entry')
- `has_valuation`: Boolean
- `has_listings`: Boolean
- `property_type`: String
- `bedrooms`: Number
- `bathrooms`: Number
- `car_spaces`: Number
- `land_area_sqm`: Number
- `load_time_ms`: Number

### property_valuation_loaded
**Trigger**: When property valuation data is loaded
**Properties**:
- `property_id`: String (hashed)
- `valuation_source`: String
- `confidence_level`: String ('high' | 'medium' | 'low')
- `days_since_valuation`: Number
- `has_comparable_sales`: Boolean

## Bridging calculator events

### bridging_calculator_opened
**Trigger**: When user navigates to bridging calculator page
**Properties**:
- `entry_source`: String ('cta_button' | 'direct_navigation' | 'menu')
- `has_existing_property_data`: Boolean
- `has_target_property_data`: Boolean
- `pre_filled_fields_count`: Number
- `session_duration_before_calc_ms`: Number

### bridging_calculation_performed
**Trigger**: When calculation engine completes a calculation
**Properties**:
- `calculation_id`: UUID
- `inputs`: {
    - `existing_property_value`: Number (bucketed: <500k, 500k-1m, 1m-2m, 2m-5m, >5m)
    - `existing_debt`: Number (bucketed)
    - `new_property_value`: Number (bucketed)
    - `bridging_term_months`: Number
    - `bridging_interest_rate`: Number
    - `repayment_type`: String ('icap' | 'interest_only')
    - `contract_of_sale_provided`: Boolean
    - `pg_included`: Boolean
    - `fees_capitalised`: Boolean
    - `purchase_costs_capitalised`: Boolean
  }
- `outputs`: {
    - `bridge_debt`: Number (bucketed)
    - `end_debt`: Number (bucketed)
    - `peak_debt_lvr_incl_icap`: Number
    - `end_debt_lvr`: Number
    - `shortfall`: Number
    - `additional_cash_required`: Number (bucketed)
    - `converged`: Boolean
    - `iterations_required`: Number
    - `calculation_time_ms`: Number
  }
- `validation`: {
    - `within_lvr_limits`: Boolean
    - `has_shortfall`: Boolean
    - `requires_additional_cash`: Boolean
  }

### bridging_calculation_failed
**Trigger**: When calculation engine fails or doesn't converge
**Properties**:
- `calculation_id`: UUID
- `error_type`: String ('convergence_failure' | 'invalid_input' | 'calculation_error')
- `iterations_attempted`: Number
- `final_convergence_value`: Number
- `input_validation_errors`: Array<String>

### bridging_input_changed
**Trigger**: When user changes any input field (debounced)
**Properties**:
- `field_name`: String
- `field_type`: String ('currency' | 'percentage' | 'months' | 'toggle' | 'select')
- `old_value`: Any (anonymized if sensitive)
- `new_value`: Any (anonymized if sensitive)
- `is_advanced_field`: Boolean
- `triggered_recalculation`: Boolean

### bridging_results_expanded
**Trigger**: When user expands calculation details or iteration logs
**Properties**:
- `section_expanded`: String ('calculation_breakdown' | 'iteration_logs')
- `time_before_expand_ms`: Number (from results shown)
- `had_convergence_issues`: Boolean
- `iteration_count`: Number

### bridging_scenario_saved
**Trigger**: When user saves or bookmarks a calculation scenario
**Properties**:
- `scenario_id`: UUID
- `has_existing_property`: Boolean
- `has_new_property`: Boolean
- `calculation_valid`: Boolean

## User flow events

### user_flow_started
**Trigger**: When user starts the property strategy flow
**Properties**:
- `entry_point`: String ('homepage_cta' | 'bridging_calculator_cta' | 'direct_url')
- `referrer`: String
- `utm_source`: String
- `utm_campaign`: String

### user_flow_progressed
**Trigger**: When user moves between pages in the flow
**Properties**:
- `from_page`: String
- `to_page`: String
- `direction`: String ('forward' | 'backward')
- `time_on_previous_page_ms`: Number
- `fields_completed_on_previous`: Number
- `fields_total_on_previous`: Number

### user_flow_completed
**Trigger**: When user completes entire flow
**Properties**:
- `total_duration_ms`: Number
- `pages_visited`: Array<String>
- `api_calls_made`: Number
- `api_failures_encountered`: Number
- `calculations_performed`: Number
- `final_strategy_viable`: Boolean

## Session and performance events

### page_performance
**Trigger**: On each page load
**Properties**:
- `page_name`: String
- `load_time_ms`: Number
- `time_to_interactive_ms`: Number
- `api_calls_on_load`: Number
- `cached_data_used`: Boolean

### session_summary
**Trigger**: When session ends or after 30 min inactivity
**Properties**:
- `session_duration_ms`: Number
- `pages_viewed`: Number
- `api_calls_total`: Number
- `api_calls_successful`: Number
- `api_calls_failed`: Number
- `calculations_performed`: Number
- `flow_completed`: Boolean
- `errors_encountered`: Array<String>

## Error tracking events

### client_error
**Trigger**: When any client-side error occurs
**Properties**:
- `error_message`: String
- `error_stack`: String (sanitized)
- `error_type`: String
- `page_context`: String
- `user_action_before_error`: String
- `api_related`: Boolean

## Implementation notes

### Privacy considerations
- Hash/anonymize sensitive property identifiers
- Bucket financial values into ranges
- Don't store actual addresses, only suburbs/postcodes
- Implement user consent for analytics

### Performance considerations
- Batch events where possible
- Use sampling for high-frequency events
- Implement client-side event queue with retry logic
- Set up event ingestion monitoring

### Key metrics to derive
1. **API reliability**: Success rate, latency P50/P95/P99
2. **Search effectiveness**: Queries to selection rate, result relevance
3. **Calculator usage**: Input patterns, calculation success rate, convergence performance
4. **User journey**: Completion rates, drop-off points, time to complete
5. **Error impact**: Error frequency, user recovery rate

### Recommended dashboards
1. **API health dashboard**: Real-time API performance and errors
2. **Calculator analytics**: Usage patterns, input distributions, success metrics
3. **User flow funnel**: Conversion at each step, abandonment analysis
4. **Error monitoring**: Error trends, impact on user journey
5. **Performance dashboard**: Page load times, API latency impact