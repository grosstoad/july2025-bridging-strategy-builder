# Property market outlook calculations

## Overview

The property market outlook feature helps users understand how market movements could impact their property strategy. It shows three scenarios (Worst, Target, Best) for each of the four property strategies.

## Core calculation formula

```
Monthly Growth Rate = Annual Growth Rate / 12
Projected Value = Current Value × (1 + Monthly Growth Rate × Months Until Transaction)
Value Change = Projected Value - Current Value
```

## Scenario definitions

- **Worst**: Market moves against your strategy
- **Target**: Expected market growth based on historical data
- **Best**: Market moves in favor of your strategy

## Growth rate assignments by scenario

| Strategy | Scenario | Current Property | New Property | Why? |
|----------|----------|------------------|--------------|------|
| **Buy Before You Sell (BBYS)** | | | | |
| | Worst | Low (-5.00%) | High (+5.00%) | Buying high, selling low |
| | Target | Target (+2.23%) | Target (+2.23%) | Normal market growth |
| | Best | High (+5.00%) | Low (-5.00%) | Buying low, selling high |
| **Sell Before You Buy (SBYB)** | | | | |
| | Worst | Low (-5.00%) | High (+5.00%) | Selling low, buying high later |
| | Target | Target (+2.23%) | Target (+2.23%) | Normal market growth |
| | Best | High (+5.00%) | Low (-5.00%) | Selling high, buying low later |
| **Keep Both (KB)** | | | | |
| | Worst | N/A (keeping) | High (+5.00%) | Buying when expensive |
| | Target | N/A (keeping) | Target (+2.23%) | Normal market growth |
| | Best | N/A (keeping) | Low (-5.00%) | Buying when cheap |
| **Settle Same Day (SS)** | | | | |
| | Worst | Low (-5.00%) | High (+5.00%) | Simultaneous bad timing |
| | Target | Target (+2.23%) | Target (+2.23%) | Normal market growth |
| | Best | High (+5.00%) | Low (-5.00%) | Simultaneous good timing |

## Transaction timing by strategy

| Strategy | Buy Timing | Sell Timing |
|----------|------------|-------------|
| BBYS | Ready date | Ready date + Time between |
| SBYB | Ready date + Time between | Ready date |
| KB | Ready date | N/A (keeping) |
| SS | Ready date | Ready date |

## Shortfall/gain calculation

### For strategies involving selling (BBYS, SBYB, SS)
```
Shortfall/Gain = (-New Property Value Change) + (Current Property Value Change)
```
- Negative result = Shortfall (you lose money)
- Positive result = Gain (you save money)

### For Keep Both (KB)
```
Shortfall/Gain = (-New Property Value Change)
```
- Only considers the new property since you're not selling

## Example calculations

### Scenario: BBYS Worst Case
- Current property: $2,000,000
- New property: $3,000,000
- Ready in: 2 months
- Time between: 6 months

**Calculations:**
1. Buy timing: 2 months from now
2. Sell timing: 8 months from now (2 + 6)
3. New property growth: $3,000,000 × (5% ÷ 12 × 2) = +$25,000
4. Current property decline: $2,000,000 × (-5% ÷ 12 × 8) = -$66,667
5. Shortfall: -$25,000 + (-$66,667) = -$91,667

### Scenario: SBYB Best Case
- Current property: $2,000,000
- New property: $3,000,000
- Ready in: 2 months
- Time between: 6 months

**Calculations:**
1. Sell timing: 2 months from now
2. Buy timing: 8 months from now (2 + 6)
3. Current property growth: $2,000,000 × (5% ÷ 12 × 2) = +$16,667
4. New property decline: $3,000,000 × (-5% ÷ 12 × 8) = -$100,000
5. Gain: -(-$100,000) + $16,667 = +$116,667

## Market risk messaging

Each strategy displays specific market risks:

- **BBYS**: "If the market in [current property location] falls while you own two properties, you may struggle to achieve your expected sale price."
- **SBYB**: "If the market in [new property location] rises after you sell, you may need to pay more for your new property."
- **KB**: "If the market in [new property location] falls, your investment property value may decrease."
- **SS**: "Market movements in [both locations] could affect both transactions."

## Key insights

1. **Worst case** always assumes you're on the wrong side of market timing
2. **Best case** assumes perfect market timing in your favor
3. **Target case** uses realistic growth expectations
4. The time between transactions amplifies the impact of market movements
5. Keep Both (KB) has simpler calculations since there's no selling involved