def simplify(amount: float) -> str:
    if not amount:
        return 0
    
    amount = float(amount)
    if amount >= 1_000_000_000_000:
        return f"{amount / 1_000_000_000_000:.2f}T"
    elif amount >= 1_000_000_000:
        return f"{amount / 1_000_000_000:.2f}B"
    elif amount >= 1_000_000:
        return f"{amount / 1_000_000:.2f}M"
    elif amount >= 1_000:
        return f"{amount / 1_000:.2f}K"
    else:
        return f"{amount:.2f}"