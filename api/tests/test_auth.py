import pytest

@pytest.mark.asyncio
async def test_register_user(async_client, test_db):
    response = await async_client.post("/auth/register", json={
        "email": "test@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_register_existing_user(async_client, test_db):
    await async_client.post("/auth/register", json={
        "email": "test@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "securepassword"
    })

    response = await async_client.post("/auth/register", json={
        "email": "test@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "securepassword"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already in use"
