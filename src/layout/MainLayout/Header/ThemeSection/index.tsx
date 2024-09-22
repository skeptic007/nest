import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { IconMoon, IconSun } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'types/config'; // Adjust the path to where your ThemeMode enum is defined

const ThemeSection = () => {
  const theme = useTheme();
  const { mode, onChangeMode } = useConfig();

  // Determine the current theme mode
  const isDarkMode = mode === ThemeMode.DARK;

  const handleToggleTheme = () => {
    onChangeMode(isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <Box
      sx={{
        ml: 2,
        [theme.breakpoints.down('lg')]: {
          mr: 2
        }
      }}
    >
      <Avatar
        variant="rounded"
        onClick={handleToggleTheme}
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          transition: 'all .2s ease-in-out',
          bgcolor: isDarkMode ? 'dark.main' : 'secondary.light',
          color: isDarkMode ? 'warning.dark' : 'secondary.dark',
          '&:hover': {
            bgcolor: isDarkMode ? 'warning.dark' : 'secondary.dark',
            color: isDarkMode ? 'grey.800' : 'secondary.light'
          },
          cursor: 'pointer'
        }}
      >
        {isDarkMode ? <IconSun size="20px" /> : <IconMoon style={{ transform: 'rotate(220deg)' }} size="20px" />}
      </Avatar>
    </Box>
  );
};

export default ThemeSection;
