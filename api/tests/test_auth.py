import pytest
from app.models.user import User
from app.core.security import get_password_hash

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

@pytest.mark.asyncio
async def test_successful_login(async_client, test_db):
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("securepassword"),
        first_name="Test",
        last_name="User"
    )
    test_db.add(user)
    await test_db.commit()
    
    response = await async_client.post("/auth/login", json={
        "email": "testuser@example.com",
        "password": "securepassword"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_email(async_client, test_db):
    response = await async_client.post("/auth/login", json={
        "email": "wrong@example.com",
        "password": "securepassword"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

@pytest.mark.asyncio
async def test_login_invalid_password(async_client, test_db):
    user = User(
        email="wrongpass@example.com",
        hashed_password=get_password_hash("rightpassword"),
        first_name="Wrong",
        last_name="Password"
    )
    test_db.add(user)
    await test_db.commit()

    response = await async_client.post("/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
