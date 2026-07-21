USE [RigForge_DB]
GO

-- 1. Kategoriler Ekle
INSERT INTO [dbo].[Kategoriler] ([KategoriAdi]) VALUES ('Ýþlemci'), ('Ekran Kartý'), ('Anakart'), ('RAM');

-- 2. Markalar Ekle
INSERT INTO [dbo].[Markalar] ([MarkaAdi]) VALUES ('Intel'), ('AMD'), ('NVIDIA'), ('ASUS');

-- 3. Örnek Ürünler Ekle (1: Ýþlemci, 2: Ekran Kartý)
INSERT INTO [dbo].[Urunler] ([UrunAdi], [Aciklama], [Fiyat], [Stok], [ResimURL], [KategoriID], [MarkaID], [AktifMi], [OlusturmaTarihi])
VALUES 
('Intel Core i9-14900K', '24 Çekirdek 32 Ýzlek Oyun Ýþlemcisi', 29999.00, 10, 'assets/i9.jpg', 1, 1, 1, GETDATE()),
('AMD Ryzen 9 7950X', '16 Çekirdek 32 Ýzlek Güçlü Ýþlemci', 24999.00, 15, 'assets/r9.jpg', 1, 2, 1, GETDATE()),
('NVIDIA RTX 5070', 'Yeni Nesil Ekran Kartý', 32499.00, 5, 'assets/rtx5070.jpg', 2, 3, 1, GETDATE());