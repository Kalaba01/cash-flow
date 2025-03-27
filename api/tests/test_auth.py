import pytest
from datetime import datetime, timedelta, timezone
from sqlalchemy.future import select
from app.models.user import User
from app.models.password_reset import PasswordResetToken
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

@pytest.mark.asyncio
async def test_forgot_password_success(async_client, test_db):
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("securepassword"),
        first_name="Test",
        last_name="User"
    )
    test_db.add(user)
    await test_db.commit()

    response = await async_client.post("/auth/forgot-password", json={"email": "testuser@example.com"})
    
    assert response.status_code == 200
    assert response.json()["message"] == "If the email exists, a reset link has been sent."

    result = await test_db.execute(select(PasswordResetToken).filter(PasswordResetToken.user_id == user.id))
    token_entry = result.scalars().first()
    
    assert token_entry is not None
    assert token_entry.token is not None

@pytest.mark.asyncio
async def test_forgot_password_invalid_email(async_client, test_db):
    response = await async_client.post("/auth/forgot-password", json={"email": "invalid@example.com"})
    
    assert response.status_code == 200
    assert response.json()["message"] == "If the email exists, a reset link has been sent."

@pytest.mark.asyncio
async def test_reset_password_success(async_client, test_db):
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("securepassword"),
        first_name="Test",
        last_name="User"
    )
    test_db.add(user)
    await test_db.commit()

    reset_token = PasswordResetToken(
        user_id=user.id,
        token="valid_reset_token",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
    )
    test_db.add(reset_token)
    await test_db.commit()

    reset_payload = {
        "token": "valid_reset_token",
        "new_password": "newsecurepassword"
    }
    response = await async_client.post("/auth/reset-password", json=reset_payload)

    assert response.status_code == 200
    assert response.json()["message"] == "Password reset successful"

    result = await test_db.execute(select(PasswordResetToken).filter(PasswordResetToken.token == "valid_reset_token"))
    deleted_token = result.scalars().first()

    assert deleted_token is None

@pytest.mark.asyncio
async def test_reset_password_invalid_token(async_client, test_db):
    response = await async_client.post("/auth/reset-password", json={"token": "invalidtoken", "new_password": "securepassword"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired token"

@pytest.mark.asyncio
async def test_reset_password_expired_token(async_client, test_db):
    user = User(
        email="expiredtoken@example.com",
        hashed_password=get_password_hash("securepassword"),
        first_name="Expired",
        last_name="Token"
    )
    test_db.add(user)
    await test_db.commit()

    expired_token = PasswordResetToken(
        user_id=user.id,
        token="expired_token",
        expires_at=datetime.now(timezone.utc) - timedelta(hours=24)
    )
    test_db.add(expired_token)
    await test_db.commit()

    response = await async_client.post("/auth/reset-password", json={"token": "expired_token", "new_password": "securepassword"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired token"

    result = await test_db.execute(select(PasswordResetToken).filter(PasswordResetToken.token == "expired_token"))
    token_entry = result.scalars().first()

    assert token_entry is not None
