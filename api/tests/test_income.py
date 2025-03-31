import pytest
from app.schemas.income import IncomeCreate, IncomeUpdate

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

@pytest.mark.asyncio
async def test_update_income(async_client, test_db):
    create_response = await async_client.post(
        "/income/",
        json={
            "category_name": "Salary",
            "amount": 5000,
            "date": "2025-04-01T10:00:00Z",
            "description": "Monthly salary"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert create_response.status_code == 200
    created_data = create_response.json()
    income_id = created_data["id"]
    
    update_payload = {
        "category_name": "Salary",
        "amount": 6000,
        "date": "2025-04-01T10:00:00Z",
        "description": "Updated monthly salary"
    }
    
    update_response = await async_client.put(
        f"/income/{income_id}",
        json=update_payload,
        headers={"Authorization": "Bearer test-token"}
    )
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["id"] == income_id
    assert updated_data["amount"] == 6000
    assert updated_data["description"] == "Updated monthly salary"

@pytest.mark.asyncio
async def test_delete_income(async_client, test_db):
    create_response = await async_client.post(
        "/income/",
        json={
            "category_name": "Freelance",
            "amount": 1500,
            "date": "2025-03-29T12:00:00Z",
            "description": "Freelance project"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert create_response.status_code == 200
    created_data = create_response.json()
    income_id = created_data["id"]
    
    delete_response = await async_client.delete(
        f"/income/{income_id}",
        headers={"Authorization": "Bearer test-token"}
    )
    assert delete_response.status_code == 200
    deleted_data = delete_response.json()
    assert deleted_data["id"] == income_id

    get_response = await async_client.get("/income/", headers={"Authorization": "Bearer test-token"})
    incomes = get_response.json()
    assert all(income["id"] != income_id for income in incomes)
