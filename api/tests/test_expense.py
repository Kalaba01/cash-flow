import pytest
from app.schemas.expense import ExpenseCreate

@pytest.mark.asyncio
async def test_create_expense(async_client, test_db):
    response = await async_client.post(
        "/expense/",
        json={
            "category_name": "Food",
            "amount": 200,
            "date": "2025-04-01T10:00:00Z",
            "description": "Lunch at restaurant"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["category_name"] == "Food"
    assert data["amount"] == 200
    assert data["description"] == "Lunch at restaurant"

@pytest.mark.asyncio
async def test_get_expenses(async_client, test_db):
    await async_client.post(
        "/expense/",
        json={
            "category_name": "Transport",
            "amount": 50,
            "date": "2025-03-29T12:00:00Z",
            "description": "Bus ticket"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    response = await async_client.get("/expense/", headers={"Authorization": "Bearer test-token"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert any(expense["category_name"] == "Transport" for expense in data)
