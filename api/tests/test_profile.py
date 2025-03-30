import pytest
from app.models.user import User
from app.core.security import get_password_hash, get_current_user
from app.main import app

@pytest.mark.asyncio
async def test_get_profile(async_client, test_db):
    response = await async_client.get(
        "/profile/",
        headers={"Authorization": "Bearer test-token"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert "first_name" in data
    assert "last_name" in data

@pytest.mark.asyncio
async def test_change_password(async_client, test_db):
    change_password_data = {
        "old_password": "randompassword",
        "new_password": "newpassword123"
    }

    response = await async_client.post(
        "/profile/change-password",
        json=change_password_data,
        headers={"Authorization": "Bearer test-token"}
    )

    if response.status_code == 400:
        assert response.json()["detail"] in [
            "Incorrect old password",
            "New password must be different from the old password"
        ]
    else:
        assert response.status_code == 200
        assert response.json()["message"] == "Password successfully changed"
