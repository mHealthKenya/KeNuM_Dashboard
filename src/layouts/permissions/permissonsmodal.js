// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Button,
//   CircularProgress,
//   Modal,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";

// export default function PermissionsModal({
//   open,
//   user,
//   permissionsList,
//   onClose,
//   onSave,
//   loading,
// }) {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [selectedPermissions, setSelectedPermissions] = useState(user?.permissions || []);

//   const handlePermissionChange = (permissionId) => {
//     setSelectedPermissions((prev) =>
//       prev.includes(permissionId)
//         ? prev.filter((id) => id !== permissionId)
//         : [...prev, permissionId]
//     );
//   };

//   const handleSave = () => {
//     onSave(selectedPermissions);
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: isSmallScreen ? "90%" : "400px",
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: isSmallScreen ? 2 : 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Set Permissions for {user?.f_name} {user?.l_name}
//         </Typography>

//         <List>
//           {permissionsList.map((permission) => (
//             <ListItem key={permission.id}>
//               <Checkbox
//                 checked={selectedPermissions.includes(permission.id)}
//                 onChange={() => handlePermissionChange(permission.id)}
//               />
//               <ListItemText primary={permission.name} />
//             </ListItem>
//           ))}
//         </List>

//         <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={onClose}
//             size={isSmallScreen ? "small" : "medium"}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             disabled={loading}
//             size={isSmallScreen ? "small" : "medium"}
//           >
//             {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }
