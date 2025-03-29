import pytest
from app.schemas.income import IncomeCreate

@pytest.mark.asyncio
async def test_create_income(async_client, test_db):
    response = await async_client.post(
        "/income/",
        json={
            "category_name": "Salary",
            "amount": 5000,
            "date": "2025-04-01T10:00:00Z",
            "description": "Monthly salary"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["category_name"] == "Salary"
    assert data["amount"] == 5000

@pytest.mark.asyncio
async def test_get_incomes(async_client, test_db):
    await async_client.post(
        "/income/",
        json={
            "category_name": "Freelance",
            "amount": 1500,
            "date": "2025-03-29T12:00:00Z",
            "description": "Freelance project"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    response = await async_client.get("/income/", headers={"Authorization": "Bearer test-token"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["category_name"] == "Freelance"
