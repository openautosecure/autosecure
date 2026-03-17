def simplify(amount: float) -> str:
    amount = float(amount)
    if amount >= 1_000_000_000_000:
        return f"{amount / 1_000_000_000_000:.2f} Trillion"
    elif amount >= 1_000_000_000:
        return f"{amount / 1_000_000_000:.2f} Billion"
    elif amount >= 1_000_000:
        return f"{amount / 1_000_000:.2f} Million"
    elif amount >= 1_000:
        return f"{amount / 1_000:.2f} Thousand"
    else:
        return f"{amount:.2f}"