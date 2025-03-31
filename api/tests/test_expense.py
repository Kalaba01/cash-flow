import pytest
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

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

@pytest.mark.asyncio
async def test_update_expense(async_client, test_db):
    create_response = await async_client.post(
        "/expense/",
        json={
            "category_name": "Food",
            "amount": 200,
            "date": "2025-04-01T10:00:00Z",
            "description": "Lunch at restaurant"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert create_response.status_code == 200
    created_data = create_response.json()
    expense_id = created_data["id"]

    update_payload = {
        "category_name": "Groceries",
        "amount": 250,
        "date": "2025-04-01T10:00:00Z",
        "description": "Grocery shopping"
    }

    update_response = await async_client.put(
        f"/expense/{expense_id}",
        json=update_payload,
        headers={"Authorization": "Bearer test-token"}
    )
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["id"] == expense_id
    assert updated_data["category_name"] == "Groceries"
    assert updated_data["amount"] == 250
    assert updated_data["description"] == "Grocery shopping"

@pytest.mark.asyncio
async def test_delete_expense(async_client, test_db):
    create_response = await async_client.post(
        "/expense/",
        json={
            "category_name": "Transport",
            "amount": 50,
            "date": "2025-03-29T12:00:00Z",
            "description": "Bus ticket"
        },
        headers={"Authorization": "Bearer test-token"}
    )
    assert create_response.status_code == 200
    created_data = create_response.json()
    expense_id = created_data["id"]

    delete_response = await async_client.delete(
        f"/expense/{expense_id}",
        headers={"Authorization": "Bearer test-token"}
    )
    assert delete_response.status_code == 200
    deleted_data = delete_response.json()
    assert deleted_data["id"] == expense_id

    get_response = await async_client.get("/expense/", headers={"Authorization": "Bearer test-token"})
    assert get_response.status_code == 200
    data = get_response.json()
    assert all(expense["id"] != expense_id for expense in data)
