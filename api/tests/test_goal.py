import pytest
from app.schemas.goal import GoalCreate, GoalUpdate
from app.models.goal import GoalType, GoalPeriod

@pytest.mark.asyncio
async def test_create_goal(async_client, test_db):
    """Test kreiranja novog cilja"""
    response = await async_client.post(
        "/goal/",
        json={
            "category_name": "salary",
            "amount": 500,
            "goal_type": "income",
            "period": "month"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["category_name"] == "salary"
    assert data["amount"] == 500
    assert data["goal_type"] == "income"
    assert data["period"] == "month"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_goals(async_client, test_db):
    """Test dohvaćanja svih ciljeva za korisnika"""
    await async_client.post(
        "/goal/",
        json={
            "category_name": "food",
            "amount": 200,
            "goal_type": "expense",
            "period": "week"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    response = await async_client.get("/goal/", headers={"Authorization": "Bearer test-token"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["category_name"] == "food"

@pytest.mark.asyncio
async def test_update_goal(async_client, test_db):
    """Test ažuriranja cilja"""
    create_response = await async_client.post(
        "/goal/",
        json={
            "category_name": "transport",
            "amount": 100,
            "goal_type": "expense",
            "period": "year"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    assert create_response.status_code == 200
    goal_id = create_response.json()["id"]

    update_response = await async_client.put(
        f"/goal/{goal_id}",
        json={
            "amount": 150,
            "period": "month"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    assert update_response.status_code == 200
    updated_goal = update_response.json()
    assert updated_goal["amount"] == 150
    assert updated_goal["period"] == "month"

@pytest.mark.asyncio
async def test_delete_goal(async_client, test_db):
    """Test brisanja cilja"""
    create_response = await async_client.post(
        "/goal/",
        json={
            "category_name": "shopping",
            "amount": 300,
            "goal_type": "expense",
            "period": "forever"
        },
        headers={"Authorization": "Bearer test-token"}
    )

    assert create_response.status_code == 200
    goal_id = create_response.json()["id"]

    delete_response = await async_client.delete(f"/goal/{goal_id}", headers={"Authorization": "Bearer test-token"})
    assert delete_response.status_code == 204

    get_response = await async_client.get("/goal/", headers={"Authorization": "Bearer test-token"})
    assert all(goal["id"] != goal_id for goal in get_response.json())
