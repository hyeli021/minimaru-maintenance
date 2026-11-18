'use client';

import { useSyncExternalStore } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useLogoutMutation } from '@/services/auth/mutations';
import { useUserQuery } from '@/services/user/queries';
import color from '@/styles/color';
import font from '@/styles/font';
import { token } from '@/utils/token';

const Header = () => {
  const { data: user } = useUserQuery();
  const { mutate: logout } = useLogoutMutation();
  const isLoggedIn = useSyncExternalStore(
    token.subscribe,
    token.exists,
    () => false,
  );

  return (
    <StyledHeader>
      <Inner>
        <Logo href="/">
          미니 마루
        </Logo>
        <Nav>
          <NavLink href="/">홈</NavLink>
          <NavLink href="/form">원서 작성</NavLink>
          <NavLink href="/result">결과 확인</NavLink>
          {isLoggedIn ? (
            <>
              <UserName>{user?.name ?? ''}님</UserName>
              <LogoutButton onClick={() => logout()}>로그아웃</LogoutButton>
            </>
          ) : (
            <NavLink href="/login">로그인</NavLink>
          )}
        </Nav>
      </Inner>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${color.gray200};
  background-color: ${color.white};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 960px;
  height: 64px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Logo = styled(Link)`
  ${font.H5};
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${color.bamdoliro};
`;

const Badge = styled.span`
  ${font.caption};
  padding: 2px 8px;
  border-radius: 999px;
  color: ${color.maruDefault};
  background-color: ${color.maruLightBlue};

  @media (max-width: 640px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLink = styled(Link)`
  ${font.context};
  color: ${color.gray700};

  &:hover {
    color: ${color.maruDefault};
  }
`;

const UserName = styled.span`
  ${font.context};
  color: ${color.gray900};
`;

const LogoutButton = styled.button`
  ${font.context};
  color: ${color.gray500};
`;
